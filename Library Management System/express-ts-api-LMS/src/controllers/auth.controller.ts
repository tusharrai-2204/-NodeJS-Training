import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import * as authService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
    try {
        const input = req.body as RegisterInput;
        const result = await authService.registerUser(input);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        res.status(400).json({
            success: false,
            message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const input = req.body as LoginInput;
        const result = await authService.loginUser(input);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        res.status(400).json({
            success: false,
            message
        });
    }
};