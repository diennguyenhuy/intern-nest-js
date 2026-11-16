import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDTO, LoginResponseDTO, RegisterDTO, RegisterResponseDTO, UserResponseDTO } from './auth.dto.js';
import { UserRole } from '../generated/prisma/enums.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        email: string;
        role: UserRole;
    }
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
    })
    @ApiCreatedResponse({
        type: RegisterResponseDTO,
        description: 'User successfully registered',
    })
    @ApiBadRequestResponse({
        description: 'Invalid registration data',
    })
    @ApiConflictResponse({
        description: 'Email already exists',
    })
    async register(@Body() dto: RegisterDTO) {
        return await this.service.register(dto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Login and obtain JWT',
    })
    @ApiOkResponse({
        type: LoginResponseDTO,
        description: 'Successfully authenticated',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials'
    })
    async login(@Body() dto: LoginDTO) {
        return await this.service.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current authenticated user',
    })
    @ApiOkResponse({
        type: UserResponseDTO,
        description: 'Current user information',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing or invalid JWT'
    })
    getMe(@Req() request: AuthenticatedRequest) {
        return request.user;
    }
}
