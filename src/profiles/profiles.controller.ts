import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Put, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { CreateProfileDTO, ProfileResponseDTO, UpdateProfileDTO } from './profiles.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Profiles')
@Controller('users')
export class ProfilesController {
    constructor(private readonly service: ProfilesService) {}

    @Get(':userId/profile')
    @ApiOperation({
        summary: 'Get a user profile'
    })
    @ApiParam({
        name: 'userId',
        type: Number,
        description: 'User ID',
    })
    @ApiOkResponse({
        description: 'Profile retrieved successfully',
        type: ProfileResponseDTO,
    })
    @ApiBadRequestResponse({
        description: 'Invalid user ID',
    })
    @ApiNotFoundResponse({
        description: 'User profile does not exist',
    })
    async getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
        const prof = await this.service.getUserProfile(userId);
        if (prof === null) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
        return prof;
    }

    @Delete(':userId/profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Delete a user profile' 
    })
    @ApiParam({ 
        name: 'userId', 
        type: Number, 
        description: 'User ID' 
    })
    @ApiNoContentResponse({ 
        description: 'Profile deleted successfully' 
    })
    @ApiBadRequestResponse({ 
        description: 'Invalid user ID' 
    })
    @ApiUnauthorizedResponse({ 
        description: 'Missing or invalid JWT' 
    })
    @ApiNotFoundResponse({ 
        description: 'User profile does not exist' 
    })
    async deleteUserProfile(@Param('userId', ParseIntPipe) userId: number) {
        if (! await this.service.deleteProfile(userId)) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
    }

    @Put(':userId/profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Create or replace a user profile' 
    })
    @ApiParam({ 
        name: 'userId', 
        type: Number, 
        description: 'User ID' 
    })
    @ApiCreatedResponse({
        description: 'Profile created or replaced successfully',
        type: ProfileResponseDTO,
    })
    @ApiBadRequestResponse({ 
        description: 'Invalid request body or user ID' 
    })
    @ApiUnauthorizedResponse({ 
        description: 'Missing or invalid JWT' 
    })
    async createOrReplaceUserProfile(@Param('userId', ParseIntPipe) userId: number, @Body() payload: CreateProfileDTO) {
        return await this.service.createOrReplaceProfile(userId, payload);
    }

    @Patch(':userId/profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Update an existing user profile' 
    })
    @ApiParam({ 
        name: 'userId', 
        type: Number, 
        description: 'User ID' 
    })
    @ApiOkResponse({
        description: 'Profile updated successfully',
        type: ProfileResponseDTO,
    })
    @ApiBadRequestResponse({ 
        description: 'Invalid request body or user ID' 
    })
    @ApiUnauthorizedResponse({ 
        description: 'Missing or invalid JWT' 
    })
    @ApiNotFoundResponse({ 
        description: 'User profile does not exist' 
    })
    async updateUserProfile(@Param('userId', ParseIntPipe) userId: number, @Body() payload: UpdateProfileDTO) {
        const prof = await this.service.updateProfile(userId, payload);
        if (prof === null) {
            throw new NotFoundException(`User ${userId} has no profile`);
        }
        return prof;
    }
}
