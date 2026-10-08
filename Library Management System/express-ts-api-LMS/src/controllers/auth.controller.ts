import type { Request, Response } from "express";
import type {
  LoginInput,
  RegisterInput,
} from "../schema/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { signToken } from "../utils/jwt.util.js";
import passport from "passport";
import * as useRepo from "../repositories/user.repo.js";
import { NotFoundError } from "../utils/AppError.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.registerUser(input);

  const token = signToken({ userId: user.id, email: user.email });

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: { ...user },
  });
};

export const login = async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const user = await authService.loginUser(input);

  const token = signToken({ userId: user.id, email: user.email });
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Login successfull",
    data: { id: user.id, email: user.email },
  });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallback = (req: Request, res: Response) => {
  if (!req.user) {
    res.redirect("http://localhost:5173/login?error=google_auth_failed");
    return;
  }

  const token = signToken({ userId: req.user.userId, email: req.user.email });
  res.cookie("token", token, COOKIE_OPTIONS);

  res.redirect("http://localhost:5173/dashboard");
};

export const getMe = async (req: Request, res: Response) => {
  // req.user has { userId, email } from the JWT
  const user = await useRepo.findUserById(req.user!.userId);

  if (!user) {
    throw new NotFoundError('User Not Found');
  }

  const { password, ...safeUser } = user;
  res.status(200).json({ success: true, data: safeUser });
};
