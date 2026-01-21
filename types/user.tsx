
export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string;
    role: 'READER' | 'CUSTOMER';
    bio: string;
    profilePicture: string;
    isVerified: boolean;
    eloScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDTO {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string;
    role: 'READER' | 'CUSTOMER';
    bio: string;
    profilePicture: string;
    isVerified: boolean;
    eloScore: number;
    createdAt: Date;
    updatedAt: Date;
}