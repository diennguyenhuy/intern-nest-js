import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, ParseIntPipe, NotFoundException, Patch, UseGuards, HttpStatus } from '@nestjs/common';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO, UserResponseDTO } from './user.dto.js';
import { UserService, type User } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new user'
    })
    @ApiCreatedResponse({
        description: 'User successfully created',
        type: UserResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid user data',
    })
    @ApiConflictResponse({
        description: 'Email already exists'
    })
    async createUser(@Body() payload: CreateUserDTO): Promise<User> {
        return await this.service.createUser(payload);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all users',
    })
    @ApiOkResponse({
        description: 'List of users',
        type: UserResponseDTO,
        isArray: true
    })
    async getUserList(): Promise<User[]> {
        return await this.service.getUserList();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a user'
    })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: Number,
    })
    @ApiOkResponse({
        description: 'User found',
        type: UserResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'ID must be an integer',
    })
    @ApiNotFoundResponse({
        description: 'User not found'
    })
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.service.getUserById(id);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }

        return user;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: Number,
    })
    @ApiOkResponse({
        description: 'User successfully updated',
        type: UserResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID or user data',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    @ApiConflictResponse({
        description: 'Email already exists',
    })
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDTO): Promise<User> {
        const user = await this.service.updateUser(id, payload);

        if (user === null) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
        return user;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: Number,
    })
    @ApiNoContentResponse({
        description: 'User successfully deleted',
    })
    @ApiBadRequestResponse({
        description: 'ID must be an integer',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        if (! await this.service.deleteUser(id)) {
            throw new NotFoundException(`User with ID ${id} is not found`);
        }
    }

    @Patch(':id/password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user password' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: Number,
    })
    @ApiOkResponse({
        description: 'Password successfully updated',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Password updated successfully for user 1',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID or password',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    async updateUserPassword(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePasswordDTO): Promise<{ message: string }> {
        const updated = await this.service.updateUserPassword(id, payload.password);
        if (!updated) {
            throw new NotFoundException(`User with ID ${id} is not found`); 
        }
        return { message: `Password updated successfully for user ${id}` };
    }
}