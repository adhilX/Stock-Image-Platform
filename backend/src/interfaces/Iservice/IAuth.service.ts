import { IUser } from "../../entity/user.entity";

export interface IAuthService {
    registerUser(userData: IUser): Promise<IUser>;
    loginUser(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}