import type { UserRole, User, UserStatus } from "../generated/prisma/client.js";
import { UserRole as USER_ROLE, UserStatus as USER_STATUS } from "../generated/prisma/client.js";
import { IsEmail, IsIn, IsString, Length, IsOptional, MinLength, MaxLength } from 'class-validator';

type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>

type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password'>>

export class CreateUserDTO implements CreateUserDto {
    @IsString()
    @Length(1, 50)
    firstName!: string;
    
    @IsString()
    @Length(1, 50)
    lastName!: string;
    
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password!: string;

    @IsIn((Object.values(USER_ROLE) as string[]).concat(Object.values(USER_ROLE).map(r => r.toLowerCase())))
    role!: UserRole;
}

export class UpdateUserDTO implements UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsIn((Object.values(USER_ROLE) as string[]).concat(Object.values(USER_ROLE).map(r => r.toLowerCase())))
    role?: UserRole;

    @IsOptional()
    @IsIn((Object.values(USER_STATUS) as string[]).concat(Object.values(USER_STATUS).map(s => s.toLowerCase())))
    status?: UserStatus;
}

export class UpdatePasswordDTO implements Pick<User, 'password'> {
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password!: string;
}