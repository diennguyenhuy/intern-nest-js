import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDTO, RegisterDTO } from './auth.dto.js';
import { UserRole } from '../generated/prisma/enums.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        email: string;
        role: UserRole;
    }
}

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDTO) {
        return await this.service.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDTO) {
        return await this.service.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() request: AuthenticatedRequest) {
        return request.user;
    }
}
