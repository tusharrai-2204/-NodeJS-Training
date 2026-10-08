import express from 'express';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import studentRoutes from './routes/student.route.js';
import issueRoutes from './routes/issue.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport.js';
import { errorHandler } from './middlewares/error.middleware.js';


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
app.use('/api/students', studentRoutes);
app.use('/api/issues', issueRoutes);

app.get("/", (_req, res) => {
    res.json({message: "LMS API running"});
});

app.use(errorHandler);

export default app;