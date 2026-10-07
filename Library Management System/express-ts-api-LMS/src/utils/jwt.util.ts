import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'KotgWXNplfOnIuJGRv2AdObqDaU28gsO9vJSHmmTZj4';
const JWT_EXPIRES_IN = '1d';

export interface JwtPayload {
    userId: number,
    email: string
};

export const signToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};