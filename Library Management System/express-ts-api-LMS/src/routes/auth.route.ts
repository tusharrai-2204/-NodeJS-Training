import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { getMe, googleAuth, googleCallback, login, logout, register } from "../controllers/auth.controller.js";
import passport from "passport";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

router.get('/google', googleAuth);
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `http://localhost:5173/login?error=google_auth_failed` }),
    googleCallback
);

export default router;