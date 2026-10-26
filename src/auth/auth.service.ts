import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isPrismaError, PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from './auth.dto.js';
import * as bcrypt from 'bcrypt';
import { EmailAlreadyExistsError } from '../users/user.error.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true
                },
            });

            return user;
        } catch (e) {
            if (isPrismaError(e, 'P2002')) {
                throw new EmailAlreadyExistsError(dto.email);
            }

            throw e;
        }
    }

    async login(dto: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException(`Invalid credentials: User email ${dto.email} does not exist`);
        }

        if (!await bcrypt.compare(dto.password, user.password)) {
            throw new UnauthorizedException('Invalid credentials: Wrong password');
        }

        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Account is not active');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 900,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        };
    }
}
