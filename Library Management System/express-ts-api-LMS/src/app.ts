import express from 'express';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import studentRoutes from './routes/student.route.js';
import issueRoutes from './routes/issue.route.js';
import fileRoutes from './routes/file.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.js';
import { errorHandler } from './middlewares/error.middleware.js';
import helmet from 'helmet';
import { apiRateLimiter } from './middlewares/rateLimit.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', apiRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/files', fileRoutes);

app.get("/", (_req, res) => {
    res.json({message: "LMS API running"});
});

app.use(errorHandler);

export default app;