import type { Request, Response } from "express";
import type {
  LoginInput,
  RegisterInput,
} from "../schema/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { generateRefreshToken, hashRefreshToken, signAccessToken } from "../utils/jwt.util.js";
import passport from "passport";
import { NotFoundError } from "../utils/AppError.js";
import * as refreshTokenRepo from "../repositories/refreshToken.repo.js";
import * as userRepo from '../repositories/user.repo.js';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
};

// Helper method to issue refresh + access token and set cookies
const issueTokens = async (res: Response, user: { id: number; email: string; role: 'admin' | 'user' }) => {
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiry = new Date(Date.now() + 24 * 7 * 60 * 60 * 1000);
  await refreshTokenRepo.saveRefreshToken(user.id, refreshTokenHash, refreshTokenExpiry);

  res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
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

  await issueTokens(res, { id: user.id, email: user.email, role: 'user' })

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: { ...user },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (refreshToken) {
    const hash = hashRefreshToken(refreshToken);
    await refreshTokenRepo.deleteRefreshToken(hash);
  }

  res.clearCookie('access_token', ACCESS_COOKIE_OPTIONS);
  res.clearCookie('refresh_token', REFRESH_COOKIE_OPTIONS);

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
      message: 'No refresh token'
    });
    return;
  }

  const hash = hashRefreshToken(refreshToken);
  const storedToken = await refreshTokenRepo.findRefreshToken(hash);

  if (!storedToken) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
    return;
  }

  const user = await userRepo.findUserById(storedToken.user_id);
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
    return;
  }

  await refreshTokenRepo.deleteRefreshToken(hash);
  await issueTokens(res, { id: user.id, email: user.email, role: user.role })

  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully"
  });
}

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallback = async (req: Request, res: Response) => {
  if (!req.user) {
    res.redirect("http://localhost:5173/login?error=google_auth_failed");
    return;
  }

  const user = await userRepo.findUserById(req.user.userId);
  if (!user) {
    res.redirect("http://localhost:5173/login?error=user_not_found");
    return;
  }

  await issueTokens(res, { id: user.id, email: user.email, role: user.role });

  res.redirect("http://localhost:5173/dashboard");
};

export const getMe = async (req: Request, res: Response) => {
  // req.user has { userId, email, role } from the JWT
  const user = await userRepo.findUserById(req.user!.userId);

  if (!user) {
    throw new NotFoundError('User Not Found');
  }

  const { password, ...safeUser } = user;
  res.status(200).json({ success: true, data: safeUser });
};
