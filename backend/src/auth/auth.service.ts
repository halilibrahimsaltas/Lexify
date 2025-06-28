import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../common/enum/user-role.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService) {}

    async register(registerDto: RegisterDto) {
        console.log('Registration attempt for:', registerDto.email);
        
        // Check if user already exists
        const existingUser = await this.userService.findUserByEmail(registerDto.email);
        if (existingUser) {
            console.log('Registration failed - user already exists');
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.hashPassword(registerDto.password);

        // Create user with default role
        const createUserDto = {
            ...registerDto,
            role: UserRole.USER,
        };

        const newUser = await this.userService.createUser(createUserDto);
        console.log('Registration successful for:', newUser.email);

        // Generate JWT token
        const payload = { email: newUser.email, sub: newUser.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        };
    }

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
                role: user.role,
            },
        };
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
