import { Injectable } from '@nestjs/common';
import { User, UserRole, UserStatus } from '../generated/prisma/client.js';
import { CreateUserDTO, UpdateUserDTO } from './user.dto.js';
import { PrismaService, isPrismaError } from '../prisma/prisma.service.js';
import { EmailAlreadyExistsError } from './user.error.js';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserList(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        const res = await this.prisma.user.deleteMany({
            where: {
                id,
            }
        });
        return res.count > 0;
    }

    async createUser(payload: CreateUserDTO): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    role: payload.role.toUpperCase() as UserRole,
                    status: 'ACTIVE',
                }
            });
        } catch (e) {
            if (isPrismaError(e, 'P2002')) {
                throw new EmailAlreadyExistsError(payload.email);
            }
            throw e;
        }
    }

    async updateUser(id: number, payload: UpdateUserDTO): Promise<User | null> {
        const user = await this.getUserById(id);

        if (user === null) return null;
        try {
            return await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    ...(payload.firstName !== undefined && {
                        firstName: payload.firstName,
                    }),
                    ...(payload.lastName !== undefined && {
                        lastName: payload.lastName,
                    }),
                    ...(payload.email !== undefined && {
                        email: payload.email,
                    }),
                    ...(payload.role !== undefined && {
                        role: payload.role.toUpperCase() as UserRole,
                    }),
                    ...(payload.status !== undefined && {
                        status: payload.status.toUpperCase() as UserStatus,
                    })
                }
            });
        } catch (e) {
             if (payload.email && isPrismaError(e, 'P2002')) {
                throw new EmailAlreadyExistsError(payload.email);
            }
            throw e;
        }
    }
}