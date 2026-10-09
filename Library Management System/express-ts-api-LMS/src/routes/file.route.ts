import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadFileMiddleware } from '../middlewares/upload.middleware.js';
import { uploadFile } from '../controllers/file.controller.js';

const router = Router();

// router.use(requireAuth);

router.post('/upload', uploadFileMiddleware, uploadFile);

export default router;