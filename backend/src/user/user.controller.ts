import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    findAllUsers(): Promise<User[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    findUserById(@Param('id') id: number): Promise<User> {
        return this.userService.findUserById(id);
    }

    @Put(':id')
    updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }

    @Get('email/:email')
    findUserByEmail(@Param('email') email: string): Promise<User> {
        return this.userService.findUserByEmail(email);
    }
}

