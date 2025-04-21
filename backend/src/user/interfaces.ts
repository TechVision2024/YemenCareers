import { UserEntity } from "./entities/user.entity";
import { UserStatus } from "./enums/status.enum";

export interface FullUserData {
    accessToken: string;
    refreshToken: string;
    user: UserEntity
}

export interface SearchUserInterface {
    id: number;
    name: string;
    status: UserStatus;
    address: string;
    email: string;
    company_type: string;
    website: string;
    profile_image_url: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    days_since_creation: number
}