import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { EmailAlreadyExistsFilter } from "./user.error.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    imports: [PrismaModule],
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