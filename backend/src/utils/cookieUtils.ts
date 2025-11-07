import { Response } from 'express';

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};

export const clearRefreshTokenCookie = (res: Response): void => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
};
