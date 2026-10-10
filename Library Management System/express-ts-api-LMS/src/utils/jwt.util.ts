import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export interface AccessTokenPayload {
    userId: number,
    email: string,
    role: 'admin' | 'user'
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
};

export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString('hex');
};

export const hashRefreshToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};