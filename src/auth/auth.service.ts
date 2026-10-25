import { Injectable } from '@nestjs/common';
import { isPrismaError, PrismaService } from '../prisma/prisma.service.js';
import { RegisterDTO } from './auth.dto.js';
import * as bcrypt from 'bcrypt';
import { EmailAlreadyExistsError } from '../users/user.error.js';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

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
}
