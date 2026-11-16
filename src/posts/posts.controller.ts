import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDTO, PostResponseDTO, UpdatePostDTO } from './posts.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
    constructor(private readonly service: PostsService) {}

    @Get('posts')
    @Roles('USER', 'ADMIN')
    @ApiOperation({
        summary: 'Get all posts',
    })
    @ApiOkResponse({
        description: 'Posts received successfully',
        type: PostResponseDTO,
        isArray: true
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
    })
    async getPosts() {
        return await this.service.getPosts();
    }

    @Get('posts/:id')
    @Roles('ADMIN', 'USER')
    @ApiOperation({
        summary: 'Get a post by ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Post ID',
    })
    @ApiOkResponse({
        description: 'Post retrieved successfully',
        type: PostResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid Post ID',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
    })
    @ApiNotFoundResponse({
        description: 'Post does not exist'
    })
    async getPostById(@Param('id', ParseIntPipe) id: number) {
        const post = await this.service.getPostById(id);

        if (post === null) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }

        return post;
    }

    @Get('users/:userId/posts')
    @Roles('ADMIN', 'USER')
    @ApiOperation({
        summary: 'Get posts belonging to a user',
    })
    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID'
    })
    @ApiOkResponse({
        description: 'User posts retrieved successfully',
        type: PostResponseDTO,
        isArray: true,
    })
    @ApiBadRequestResponse({
        description: 'Invalid user ID',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
    })
    async getPostsByUser(@Param('userId', ParseIntPipe) userId: number) {
        return await this.service.getPostsByUserId(userId);
    }

    @Delete('posts/:id')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete a post by ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Post ID'
    })
    @ApiNoContentResponse({
        description: 'Post deleted successfully',
    })
    @ApiBadRequestResponse({
        description: 'Invalid post ID',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'ADMIN role required',
    })
    @ApiNotFoundResponse({
        description: 'Post does not exist',
    })
    async deletePost(@Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePost(id)) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }
    }

    @Delete('users/:userId/posts/:id')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete a post belonging to a user',
    })
    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Post ID',
    })
    @ApiNoContentResponse({
        description: 'Post deleted successfully',
    })
    @ApiBadRequestResponse({
        description: 'Invalid post ID or user ID',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'ADMIN role required',
    })
    @ApiNotFoundResponse({
        description: 'Post does not exist for this user',
    })
    async deletePostByUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePostByUser(id, userId)) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }
    }

    @Post('users/:userId/posts')
    @Roles('ADMIN', 'USER')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a post for this user',
    })
    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID',
    })
    @ApiCreatedResponse({
        description: 'Post created successfully',
        type: PostResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid request body or user ID',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions',
    })
    async createPost(@Param('userId', ParseIntPipe) userId: number, @Body() payload: CreatePostDTO) {
        return await this.service.createPost(userId, payload);
    }

    @Patch('users/:userId/posts/:id')
    @Roles('ADMIN')
    @ApiOperation({
        summary: 'Update a post belonging to a user',
    })
    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Post ID',
    })
    @ApiOkResponse({
        description: 'post updated successfully',
        type: PostResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid request body or parameters'
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT',
    })
    @ApiForbiddenResponse({
        description: 'ADMIN role required',
    })
    @ApiNotFoundResponse({
        description: 'Post does not exist for this user',
    })
    async updatePost(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePostDTO) {
        const res = await this.service.updatePost(id, userId, payload);

        if (res === null) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }

        return res;
    }
}
