import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Post } from '../generated/prisma/client.js';
import { CreatePostDTO, UpdatePostDTO } from './posts.dto.js';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async getPosts(): Promise<Post[]> {
        return await this.prisma.post.findMany();
    }

    async getPostById(id: number): Promise<Post | null> {
        return await this.prisma.post.findUnique({
            where: { id }
        });
    }

    async getPostsByUserId(userId: number): Promise<Post[]> {
        return await this.prisma.post.findMany({
            where: {
                userId,
            }
        })
    }

    async deletePost(id: number): Promise<boolean> {
        const res = await this.prisma.post.deleteMany({
            where: { id }
        });

        return res.count > 0;
    }

    async deletePostByUser(id: number, userId: number): Promise<boolean> {
        const res = await this.prisma.post.deleteMany({
            where: {
                id,
                userId
            }
        });

        return res.count > 0;
    }

    async createPost(userId: number, payload: CreatePostDTO): Promise<Post> {
        return await this.prisma.post.create({
            data: {
                userId,
                title: payload.title,
                content: payload.content,
            }
        });
    }

    async updatePost(id: number, userId: number, payload: UpdatePostDTO): Promise<Post | null> {
        const posts = await this.prisma.post.findMany({
            where: {
                id,
                userId,
            }
        });

        if (posts.length <= 0) return null;

        return await this.prisma.post.update({
            where: {
                id, 
                userId,
            },
            data: {
                ...(payload.title !== undefined && {
                    title: payload.title,
                }),
                ...(payload.content !== undefined && {
                    content: payload.content,
                }),
            }
        });
    }
}
