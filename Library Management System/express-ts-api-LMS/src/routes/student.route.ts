import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateQuery } from "../middlewares/schema.middleware.js";
import { studentQuerySchema } from "../schema/student.schema.js";
import { createStudent, deleteStudent, exportStudents, getAllStudents, getStudent, getStudents, updateStudent } from "../controllers/student.controller.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('admin'), validateQuery(studentQuerySchema), getStudents);
router.get('/all', requireRole('admin'), getAllStudents);

router.get('/export', requireRole('admin'), exportStudents);

router.get('/:id', requireRole('admin'), getStudent);
router.post('/', requireRole('admin'), uploadImageMiddleware, createStudent);
router.patch('/:id', requireRole('admin'), uploadImageMiddleware, updateStudent);
router.delete('/:id', requireRole('admin'), deleteStudent);

export default router;