import { IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";
import type { Profile } from "../generated/prisma/client.js";

type CreateProfileDto = Pick<Profile, 'bio' | 'avatar'>;
type UpdateProfileDto = Partial<CreateProfileDto>;

export class CreateProfileDTO implements CreateProfileDto {
    @IsString()
    @ValidateIf((_, v) => v !== null)
    bio!: string | null;

    @IsString()
    @IsUrl()
    @ValidateIf((_, v) => v !== null)
    avatar!: string | null;
}

export class UpdateProfileDTO implements UpdateProfileDto {
    @IsString()
    @IsOptional()
    bio?: string | null;

    @IsString()
    @IsUrl()
    @IsOptional()
    avatar?: string | null;
}