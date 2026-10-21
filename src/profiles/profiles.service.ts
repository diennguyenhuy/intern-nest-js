import { Injectable } from '@nestjs/common';
import { PrismaService, isPrismaError } from '../prisma/prisma.service.js';
import { Profile } from '../generated/prisma/client.js';
import { CreateProfileDTO, UpdateProfileDTO } from './profiles.dto.js';

@Injectable()
export class ProfilesService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserProfile(userId: number): Promise<Profile | null> {
        return await this.prisma.profile.findUnique({
            where: { userId }
        });
    }

    async createOrReplaceProfile(userId: number, payload: CreateProfileDTO): Promise<Profile> {
        return this.prisma.profile.upsert({
            where: {
                userId,
            },
            create: {
                userId,
                bio: payload.bio,
                avatar: payload.avatar,
            },
            update: {
                bio: payload.bio,
                avatar: payload.avatar,
            },
        })
    }

    async updateProfile(userId: number, payload: UpdateProfileDTO): Promise<Profile | null> {
        const prof = await this.getUserProfile(userId);
        if (prof === null) return null;

        return await this.prisma.profile.update({
            where: { userId },
            data: {
                ...(payload.bio !== undefined && {
                    bio: payload.bio,
                }),
                ...(payload.avatar !== undefined && {
                    avatar: payload.avatar,
                }),
            }
        })
    }

    async deleteProfile(userId: number): Promise<boolean> {
        const res = await this.prisma.profile.deleteMany({
            where: { userId }
        });

        return res.count > 0;
    }
}
