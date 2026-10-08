import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// validates req.body
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        })),
      });
    }

    req.body = result.data;
    next();
  };
};

// validates req.query
export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }))
      });
    }

    res.locals.query = result.data;
    next();
  };
};
