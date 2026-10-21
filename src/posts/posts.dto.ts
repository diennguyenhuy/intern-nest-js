import type { Post } from "../generated/prisma/client.js";
import { IsOptional, IsPositive, IsString, Length, MinLength } from 'class-validator';

type CreatePostDto = Pick<Post, 'title' | 'content'>;

type UpdatePostDto = Partial<CreatePostDto>

export class CreatePostDTO implements CreatePostDto {
    @IsString()
    @Length(1, 50)
    title!: string;
    
    @IsString()
    @MinLength(1)
    content!: string;
}

export class UpdatePostDTO implements UpdatePostDto {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    title?: string;
    
    @IsOptional()
    @IsString()
    @MinLength(1)
    content?: string;
}