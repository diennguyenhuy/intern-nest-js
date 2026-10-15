import type { User } from "./user.model.js";

import { IsEmail, IsIn, IsString, Length, IsOptional } from 'class-validator';

type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>

type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>

export class CreateUserDTO implements CreateUserDto {
    @IsString()
    @Length(1, 50)
    firstName!: string;

    @IsString()
    @Length(1, 50)
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsIn(['user', 'admin'])
    role!: 'user' | 'admin';
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
    @IsIn(['user', 'admin'])
    role?: 'user' | 'admin';

    @IsOptional()
    @IsIn(['active', 'suspended', 'deleted'])
    status?: 'active' | 'suspended' | 'deleted';
}
