import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // max 5 attempts allowed per window
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // max 100 requests allowed per window
    message: {
        success: false,
        message: "Too many requests. Please slow down."
    },
    standardHeaders: true,
    legacyHeaders: false
});