import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { CreateProfileDTO, UpdateProfileDTO } from './profiles.dto.js';

@Controller('users')
export class ProfilesController {
    constructor(private readonly service: ProfilesService) {}

    @Get(':userId/profile')
    async getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
        const prof = await this.service.getUserProfile(userId);
        if (prof === null) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
        return prof;
    }

    @Delete(':userId/profile')
    async deleteUserProfile(@Param('userId', ParseIntPipe) userId: number) {
        if (! await this.service.deleteProfile(userId)) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
    }

    @Put(':userId/profile')
    async createOrReplaceUserProfile(@Param('userId', ParseIntPipe) userId: number, @Body() payload: CreateProfileDTO) {
        return await this.service.createOrReplaceProfile(userId, payload);
    }

    @Patch(':userId/profile')
    async updateUserProfile(@Param('userId', ParseIntPipe) userId: number, @Body() payload: UpdateProfileDTO) {
        const prof = await this.service.updateProfile(userId, payload);
        if (prof === null) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
        return prof;
    }
}
