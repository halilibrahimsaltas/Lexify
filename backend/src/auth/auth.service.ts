import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService) {}

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        try {
            console.log('Validating user:', email);
            const user = await this.userService.findUserByEmail(email);
            console.log('Found user:', user ? 'Yes' : 'No');
            
            if (!user) {
                console.log('User not found');
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
            },
        };
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
