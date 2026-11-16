import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole as USER_ROLE, UserRole, UserStatus, UserStatus as USER_STATUS } from "../generated/prisma/client.js";

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @IsEmail()
    @MaxLength(254)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}

export class LoginDTO {
    @IsEmail()
    @MaxLength(254)
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserResponseDTO {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    email: string;

    @ApiProperty({
        enum: Object.values(USER_ROLE)
    })
    role: UserRole;
}

export class RegisterResponseDTO {
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    email: string;
    @ApiProperty({
        enum: Object.values(USER_ROLE)
    })
    role: UserRole;
    @ApiProperty({
        enum: Object.values(USER_STATUS)
    })
    status: UserStatus;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    id: number;
}

export class LoginResponseDTO {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    tokenType: string;
    @ApiProperty()
    expiresIn: number;
    @ApiProperty()
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    };
}