import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerOrRolesGuard } from '../auth/guards/owner-or-roler.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enum/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'Return all users' })
    findAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by id (Owner or Admin)' })
    @ApiResponse({ status: 200, description: 'Return user by id' })
    findUserById(@Param('id' ,ParseIntPipe) id: number): Promise<User> {
        return this.userService.findUserById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user (Owner or Admin)' })
    @ApiResponse({ status: 200, description: 'User successfully updated' })
    updateUser(@Param('id' , ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, OwnerOrRolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }

    @Get('email/:email')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    findUserByEmail(@Param('email') email: string): Promise<User> {
        return this.userService.findUserByEmail(email);
    }
}

