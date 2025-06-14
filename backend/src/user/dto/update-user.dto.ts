import { IsEmail, IsOptional, IsString, Length, Matches, IsEnum, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enum/user-role.enum';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'User full name',
        example: 'John Doe',
        minLength: 2,
        maxLength: 50
    })
    @IsOptional()
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
    name?: string;

    @ApiPropertyOptional({
        description: 'User email address',
        example: 'user@example.com'
    })
    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format.' })
    email?: string;

    @ApiPropertyOptional({
        description: 'User role',
        example: UserRole.USER,
        enum: UserRole
    })
    @IsOptional()
    @IsEnum(UserRole, { message: 'Invalid role' })
    role?: UserRole;


    @ApiPropertyOptional({
        description: 'User words',
        example: ['word1', 'word2', 'word3'],
        type: [String]
    })
    @IsOptional()
    @IsArray()
    words?: string[];

    @ApiPropertyOptional({
        description: 'User password',
        example: 'Password123!',
        minLength: 8,
        maxLength: 32
    })
    @IsOptional()
    @IsString()
    @Length(8, 32, { message: 'Password must be 8-32 characters long.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
        message: 'Password must contain only letters, numbers, and allowed special characters.',
    })
    password?: string;
}