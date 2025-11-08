import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { StatusCode } from "../constants/statusCodes";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers['x-access-token'] as string;

    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: "Access token is required" });
      return;
    }

    const decoded = verifyAccessToken(token) as { id: string; email: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token" });
    return;
  }
};

