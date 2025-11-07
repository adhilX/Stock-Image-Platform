
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../entity/user.entity";
import { IUserRepo } from "../interfaces/Irepo/Iauth.repo";
import { IAuthService } from "../interfaces/Iservice/IAuth.service";
import { comparePassword, hashPassword } from "../utils/passwordHash";
import { generateAccessToken, generateRefreshToken,verifyRefreshToken } from "../utils/jwt";

export class AuthService implements IAuthService {
    constructor(private _authRepo: IUserRepo) { }

    async registerUser(userData: IUser): Promise<IUser> {
        const { name, email, password } = userData;
        const existEmail = await this._authRepo.findByEmail(email);

        if (existEmail) {
            throw new Error("User already exists");
        }
        const HashedPass = await hashPassword(password);
        const user = await this._authRepo.create({ name, email, password: HashedPass });
        return user;
    }

    async loginUser(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const existUser = await this._authRepo.findByEmail(email);
        if (!existUser) {
            throw new Error("User not found");
        }
        const passCompare = await comparePassword(password, existUser.password);
        if (!passCompare) {
            throw new Error("Password does not match");
        }
        
        const payload = { id: existUser._id, email: existUser.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return { user: existUser, accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
            const user = await this._authRepo.findById(decoded.id);
            
            if (!user) {    
                throw new Error("User not found");
            }
            
            const payload = { id: user._id, email: user.email };
            const newAccessToken = generateAccessToken(payload);
            const newRefreshToken = generateRefreshToken(payload);
            
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }
}