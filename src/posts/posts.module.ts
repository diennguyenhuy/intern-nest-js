import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
