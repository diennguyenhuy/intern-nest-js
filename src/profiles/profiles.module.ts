import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ProfilesService],
  controllers: [ProfilesController]
})
export class ProfilesModule {}
