import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDTO, UpdatePostDTO } from './posts.dto.js';

@Controller()
export class PostsController {
    constructor(private readonly service: PostsService) {}

    @Get('posts')
    async getPosts() {
        return await this.service.getPosts();
    }

    @Get('posts/:id')
    async getPostById(@Param('id', ParseIntPipe) id: number) {
        const post = await this.service.getPostById(id);

        if (post === null) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }

        return post;
    }

    @Get('users/:userId/posts')
    async getPostsByUser(@Param('userId', ParseIntPipe) userId: number) {
        return await this.service.getPostsByUserId(userId);
    }

    @Delete('posts/:id')
    async deletePost(@Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePost(id)) {
            throw new NotFoundException(`There is no post with ID ${id}`);
        }
    }

    @Delete('users/:userId/posts/:id')
    async deletePostByUser(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
        if (!await this.service.deletePostByUser(id, userId)) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }
    }

    @Post('users/:userId/posts')
    async createPost(@Param('userId', ParseIntPipe) userId: number, @Body() payload: CreatePostDTO) {
        return await this.service.createPost(userId, payload);
    }

    @Patch('users/:userId/posts/:id')
    async updatePost(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number, @Body() payload: UpdatePostDTO) {
        const res = await this.service.updatePost(id, userId, payload);

        if (res === null) {
            throw new NotFoundException(`There is no post with ID ${id} belonging to user ${userId}`);
        }

        return res;
    }
}
