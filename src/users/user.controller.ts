import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, ParseIntPipe, NotFoundException } from '@nestjs/common';
import type { User } from './user.model.js';
import type { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    createUser(@Body() payload: CreateUserDto): User {
        return this.service.createUser(payload);
    }

    @Get()
    getUserList(): User[] {
        return this.service.getUserList();
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number): User {
        const user = this.service.getUserById(id);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }

        return user;
    }

    @Put(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto): User {
        const user = this.service.updateUser(id, payload);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }

    @Delete(':id')
    @HttpCode(204)
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        if (!this.service.deleteUser(id)) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
    }
}