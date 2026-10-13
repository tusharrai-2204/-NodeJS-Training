import type { Request, Response } from "express";
import type { ChangePasswordInput, LoginInput, RegisterInput } from "../schema/auth.schema.js";
import * as authService from "../services/auth.service.js";
import {
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from "../utils/jwt.util.js";
import passport from "passport";
import { NotFoundError, UnauthorizedError } from "../utils/AppError.js";
import * as refreshTokenRepo from "../repositories/refreshToken.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import bcrypt from 'bcrypt';

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
};

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Helper method to issue refresh + access token and set cookies
const issueTokens = async (
  res: Response,
  user: {
    id: number;
    email: string;
    role: "admin" | "user" | "student";
    student_id?: number | null;
    password_changed?: boolean;
  },
) => {
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    ...(user.role === "student" && {
      studentId: user.student_id ?? undefined,
      requiresPasswordChange: !user.password_changed,
    }),
  });

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiry = new Date(Date.now() + 24 * 7 * 60 * 60 * 1000);
  await refreshTokenRepo.saveRefreshToken(
    user.id,
    refreshTokenHash,
    refreshTokenExpiry,
  );

  res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);
};

export const login = async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const user = await authService.loginUser(input);

  await issueTokens(res, { id: user.id, email: user.email, role: user.role });

  res.status(200).json({
    success: true,
    message: "Login successfull",
    data: { id: user.id, email: user.email, role: user.role },
  });
};

export const register = async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const user = await authService.registerUser(input);

  await issueTokens(res, { id: user.id, email: user.email, role: "user" });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: { ...user },
  });
};

export const studentLogin = async (req: Request, res: Response) => {
  const input = req.body as { roll_no: string; phone: string };
  const user = await authService.studentLoginUser(input);

  await issueTokens(res, {
    id: user.id,
    email: user.email,
    role: user.role,
    student_id: user.student_id,
    password_changed: user.password_changed,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      requiresPasswordChange: !user.password_changed,
    },
  });
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Please login');
  }

  const { new_password } = req.body as ChangePasswordInput;
  const hashedPassword = await bcrypt.hash(new_password, 10);
  await userRepo.updateUserPassword(req.user.userId, hashedPassword);

  res.status(200).json({ success: true, message: "Password changed successfully" });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (refreshToken) {
    const hash = hashRefreshToken(refreshToken);
    await refreshTokenRepo.deleteRefreshToken(hash);
  }

  res.clearCookie("access_token", ACCESS_COOKIE_OPTIONS);
  res.clearCookie("refresh_token", REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      message: "No refresh token",
    });
    return;
  }

  const hash = hashRefreshToken(refreshToken);
  const storedToken = await refreshTokenRepo.findRefreshToken(hash);

  if (!storedToken) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
    return;
  }

  const user = await userRepo.findUserById(storedToken.user_id);
  if (!user) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
    return;
  }

  await refreshTokenRepo.deleteRefreshToken(hash);
  await issueTokens(res, {
    id: user.id,
    email: user.email,
    role: user.role,
    student_id: user.student_id,
    password_changed: user.password_changed,
  });

  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
  });
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallback = async (req: Request, res: Response) => {
  if (!req.user) {
    res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    return;
  }

  const user = await userRepo.findUserById(req.user.userId);
  if (!user) {
    res.redirect(`${FRONTEND_URL}/login?error=user_not_found`);
    return;
  }

  await issueTokens(res, { id: user.id, email: user.email, role: user.role });

  res.redirect(`${FRONTEND_URL}/dashboard`);
};

export const getMe = async (req: Request, res: Response) => {
  const user = await userRepo.findUserById(req.user!.userId);

  if (!user) {
    throw new NotFoundError("User Not Found");
  }

  const { password, ...safeUser } = user;
  res.status(200).json({ success: true, data: safeUser });
};
