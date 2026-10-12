import type { User } from "./user.model.js";

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>

export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>