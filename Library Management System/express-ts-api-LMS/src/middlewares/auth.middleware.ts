import type { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/jwt.util.js";

declare global {
    namespace Express {
        interface User {
            userId: number; 
            email: string;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token as string | undefined;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Please login"
        });
        return;
    }

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Please login'
        })
    }
};