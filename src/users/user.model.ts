export interface User {
    readonly id: number,
    firstName: string,
    lastName: string,
    email: string,
    role: 'user' | 'admin',
    status: 'active' | 'suspended' | 'deleted',
    readonly createdAt: Date,
    updatedAt: Date,
}