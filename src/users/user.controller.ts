import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, ParseIntPipe, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from './user.dto.js';
import { UserService, type User } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

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
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDTO): Promise<User> {
        const user = await this.service.updateUser(id, payload);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        if (! await this.service.deleteUser(id)) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
    }

    @Patch(':id/password')
    @UseGuards(JwtAuthGuard)
    async updateUserPassword(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePasswordDTO): Promise<{ message: string }> {
        const updated = await this.service.updateUserPassword(id, payload.password);
        if (!updated) {
            throw new NotFoundException(`User with ID ${id} is not found`); 
        }
        return { message: `Password updated successfully for user ${id}` };
    }
}