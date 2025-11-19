import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { formatUserResponse } from "../utils/responseError";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/cookieUtils";
import { handleControllerError } from "../utils/responseError";
import { AuthRequest } from "../middlewares/auth";
import { IAuthService } from "../interfaces/Iservice/IAuth.service";

export  class AuthController{

constructor(private _authService:IAuthService){}



registerController = async (req: Request, res: Response):Promise<void> => {

     const { name, email, phone, password } = req.body.user;
     try {
       const user = await this._authService.registerUser({ name, email, phone, password })
         res.status(StatusCode.CREATED).json({
              message: "User registered successfully",
              user: formatUserResponse(user)
         })
         return
     } catch (error) {
          handleControllerError(error, res, "registerUser");
     }
};



  loginController = async (req: Request, res: Response): Promise<void> => {
     const { email, password } = req.body;
     console.log(email, password);
     try {
         const { user, accessToken, refreshToken } = await this._authService.loginUser(email, password);
         
         setRefreshTokenCookie(res, refreshToken);

         res.status(StatusCode.OK).json({ 
             message: 'User logged in successfully', 
             accessToken, 
             user: formatUserResponse(user)
         });

     } catch (error) {
          handleControllerError(error, res, "loginUser");
     }
};

 refreshTokenController = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "Refresh token not found" });
            return;
        }

        const { accessToken, refreshToken: newRefreshToken } = await this._authService.refreshToken(refreshToken);
        
        setRefreshTokenCookie(res, newRefreshToken);

        res.status(StatusCode.OK).json({ 
            message: 'Token refreshed successfully', 
            accessToken 
        });

    } catch (error) {
        handleControllerError(error, res, "refreshToken", StatusCode.UNAUTHORIZED);
    }
};
  logoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        clearRefreshTokenCookie(res);

        res.status(StatusCode.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        handleControllerError(error, res, "logout");
    }
};

 changePasswordController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Current password and new password are required" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "New password must be at least 6 characters long" });
            return;
        }

        await this._authService.changePassword(userId, currentPassword, newPassword);

        res.status(StatusCode.OK).json({ message: "Password changed successfully" });
    } catch (error) {
        handleControllerError(error, res, "changePassword");
    }
};

}
