import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { UserRole } from '../common/enum/user-role.enum';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      console.log('Validating user:', email);
      const user = await this.userService.findUserByEmail(email);
      console.log('Found user:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('User not found');
        return null;
      }

      // Sadece provider 'local' olanlar şifreyle giriş yapabilir
      if (user.provider !== 'local') {
        console.log('User provider is not local');
        return null;
      }

      console.log('Comparing passwords');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password');
        return null;
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    console.log('Login attempt for:', loginDto.email);
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      console.log('Login failed - invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Login successful for:', user.email);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async googleMobileLogin(idToken: string) {
    // 1. Google token'ı doğrula
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new UnauthorizedException('Google doğrulama başarısız');

    // 2. Kullanıcıyı bul veya oluştur
    let user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      user = await this.userService.createUser({
        name: payload.name || payload.email,
        email: payload.email,
        password: 'google', // Google ile girişte şifreye gerek yok
        role: UserRole.USER,
        provider: 'google',
      });
    }

    // 3. JWT üret ve dön (mevcut login fonksiyonunu kullanabilirsin)
    return this.login(user);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
