import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { EmailAlreadyExistsFilter } from "./user.error.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [UserController],
    providers: [
        UserService, 
        {
            provide: APP_FILTER,
            useClass: EmailAlreadyExistsFilter
        },
    ]
})
export class UserModule {}