import { Injectable } from '@nestjs/common';
import { User } from './user.model.js';
import { USERS_SEED } from './user.seed.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';

@Injectable()
export class UserService {
    private users: User[] = USERS_SEED.map(user => ({...user}));
    private idCounter = Math.max(0, ...this.users.map(u => u.id));

    getUserList(): User[] {
        return this.users.map(u => ({...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt)}));
    }

    getUserById(id: number): User | null {
        return this.users.find(u => u.id === id) ?? null;
    }

    deleteUser(id: number): boolean {
        const i = this.users.findIndex(user => user.id === id);

        if (i === -1) {
            return false;
        }

        this.users.splice(i, 1);
        return true;
    }

    createUser(payload: CreateUserDto): User {
        const user: User = {
            id: ++this.idCounter,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        this.users.push(user);
        return user;
    }

    updateUser(id: number, payload: UpdateUserDto): User | null {
        const user = this.getUserById(id);

        if (user === null) return null;

        if (payload.firstName !== undefined) {
            user.firstName = payload.firstName;
        }
        if (payload.lastName !== undefined) {
            user.lastName = payload.lastName;
        }
        if (payload.email !== undefined) {
            user.email = payload.email;
        }
        if (payload.role !== undefined) {
            user.role !== payload.role;
        }
        if (payload.status !== undefined) {
            user.status = payload.status;
        }

        return user;
    }
}