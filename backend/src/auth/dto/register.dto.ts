import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enum/user-role.enum';

export class RegisterDto {
    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
        minLength: 2,
        maxLength: 50
    })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
    name: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com'
    })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format.' })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password123!',
        minLength: 8,
        maxLength: 32
    })
    @IsNotEmpty()
    @IsString()
    @Length(8, 32, { message: 'Password must be 8-32 characters long.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
        message: 'Password must contain only letters, numbers, and allowed special characters.',
    })
    password: string;
} 