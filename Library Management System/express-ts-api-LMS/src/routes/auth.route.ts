import { Router } from "express";
import { validate } from "../middlewares/schema.middleware.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import { getMe, googleAuth, googleCallback, login, logout, refreshTokenHandler, register } from "../controllers/auth.controller.js";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);

router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.post('/refresh', refreshTokenHandler);

router.get('/google', googleAuth);
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `http://localhost:5173/login?error=google_auth_failed` }),
    googleCallback
);

export default router;