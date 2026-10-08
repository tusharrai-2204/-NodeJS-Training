import express from 'express';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requireAuth } from './middlewares/auth.middleware.js';
import passport from 'passport';
import './config/passport.js';


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get("/", requireAuth, (_req, res) => {
    res.json({
        message: "Library Management System API running"
    });
});

export default app;