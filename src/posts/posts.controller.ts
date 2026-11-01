import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDTO, UpdatePostDTO } from './posts.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller()
export class PostsController {
    constructor(private readonly service: PostsService) {}

    @Get('posts')
    @Roles('USER', 'ADMIN')
    async getPosts() {
        return await this.service.getPosts();
    }

    @Get('posts/:id')
    @Roles('ADMIN', 'USER')
    async getPostById(@Param('id', ParseIntPipe) id: number) {
        const post = await this.service.getPostById(id);

        if (post === null) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }

        return post;
    }

    @Get('users/:userId/posts')
    @Roles('ADMIN', 'USER')
    async getPostsByUser(@Param('userId', ParseIntPipe) userId: number) {
        return await this.service.getPostsByUserId(userId);
    }

    @Delete('posts/:id')
    @Roles('ADMIN')
    async deletePost(@Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePost(id)) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }
    }

    @Delete('users/:userId/posts/:id')
    @Roles('ADMIN')
    async deletePostByUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePostByUser(id, userId)) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }
    }

    @Post('users/:userId/posts')
    @Roles('ADMIN', 'USER')
    async createPost(@Param('userId', ParseIntPipe) userId: number, @Body() payload: CreatePostDTO) {
        return await this.service.createPost(userId, payload);
    }

    @Patch('users/:userId/posts/:id')
    @Roles('ADMIN')
    async updatePost(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePostDTO) {
        const res = await this.service.updatePost(id, userId, payload);

        if (res === null) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }

        return res;
    }
}
