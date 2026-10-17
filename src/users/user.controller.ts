import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, ParseIntPipe, NotFoundException } from '@nestjs/common';
import type { User } from '../generated/prisma/client.js';
import { CreateUserDTO, UpdateUserDTO } from './user.dto.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    @HttpCode(201)
    async createUser(@Body() payload: CreateUserDTO): Promise<User> {
        return await this.service.createUser(payload);
    }

    @Get()
    async getUserList(): Promise<User[]> {
        return await this.service.getUserList();
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.service.getUserById(id);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }

        return user;
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDTO): Promise<User> {
        const user = await this.service.updateUser(id, payload);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        if (! await this.service.deleteUser(id)) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
    }
}