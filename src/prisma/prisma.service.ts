import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService: ConfigService) {
        const adapter = new PrismaPg({
            connectionString: configService.getOrThrow<string>('DATABASE_URL')
        });
        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}

export function isPrismaError(e: unknown, code: string): e is Prisma.PrismaClientKnownRequestError {
    return e instanceof Prisma.PrismaClientKnownRequestError && e.code === code;
}
