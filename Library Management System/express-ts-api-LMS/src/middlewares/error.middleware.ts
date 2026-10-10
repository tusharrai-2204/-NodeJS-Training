import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import multer from "multer";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      code: err.code,
      field: err.field
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
};