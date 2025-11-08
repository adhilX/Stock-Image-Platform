import { Request, Response } from 'express';
import { StatusCode } from '../constants/statusCodes';
import { IUser } from '../entity/user.entity';
export const handleControllerError = (
    error: unknown, 
    res: Response, 
    operation: string,
    statusCode: number = StatusCode.INTERNAL_SERVER_ERROR
): void => {
    if (error instanceof Error) {
        console.log(`${operation} ERROR:`, error);
        res.status(statusCode).json({ message: error.message });
        return;
    }
    res.status(statusCode).json({ message: "Unknown error occurred" });
    return;
};

export const formatUserResponse = (user: IUser) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
});
