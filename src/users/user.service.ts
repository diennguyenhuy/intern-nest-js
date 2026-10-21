import { Injectable } from '@nestjs/common';
import { Prisma, UserRole, UserStatus } from '../generated/prisma/client.js';
import { CreateUserDTO, UpdateUserDTO } from './user.dto.js';
import { PrismaService, isPrismaError } from '../prisma/prisma.service.js';
import { EmailAlreadyExistsError } from './user.error.js';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;
const USER_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true
} satisfies Prisma.UserSelect;
export type User = Prisma.UserGetPayload<{
    select: typeof USER_SELECT,
}>;

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserList(): Promise<User[]> {
        return await this.prisma.user.findMany({
            select: USER_SELECT,
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id },
            select: USER_SELECT,
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        const res = await this.prisma.user.deleteMany({
            where: { id }
        });
        return res.count > 0;
    }

    async createUser(payload: CreateUserDTO): Promise<User> {
        const passwordHash = await bcrypt.hash(payload.password!, BCRYPT_ROUNDS);

        try {
            return await this.prisma.user.create({
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: passwordHash, 
                    role: payload.role.toUpperCase() as UserRole,
                    status: 'ACTIVE',
                },
                select: USER_SELECT,
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
                where: { id },
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
                },
                select: USER_SELECT,
            });
        } catch (e) {
             if (payload.email && isPrismaError(e, 'P2002')) {
                throw new EmailAlreadyExistsError(payload.email);
            }
            throw e;
        }
    }

    async updateUserPassword(id: number, password: string): Promise<boolean> {
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const result = await this.prisma.user.updateMany({
            where: { id },
            data: { password: passwordHash }
        });

        return result.count > 0;
    }
}