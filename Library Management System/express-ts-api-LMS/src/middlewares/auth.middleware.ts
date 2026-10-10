import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.util.js";

declare global {
  namespace Express {
    interface User {
      userId: number;
      email: string;
      role: "admin" | "user";
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.access_token as string | undefined;

  if (!accessToken) {
    res.status(401).json({
      success: false,
      message: "Please login",
    });
    return;
  }

  try {
    const payload = verifyAccessToken(accessToken);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Please login",
    });
  }
};

// Role-based authorization
export const requireRole = (...roles: ("admin" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Please login",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access Denied",
      });
      return;
    }
    next();
  };
};
