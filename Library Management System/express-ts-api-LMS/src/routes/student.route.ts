import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateQuery } from "../middlewares/schema.middleware.js";
import { studentQuerySchema } from "../schema/student.schema.js";
import { createStudent, deleteStudent, exportStudents, getAllStudents, getStudent, getStudents, updateStudent } from "../controllers/student.controller.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(studentQuerySchema), getStudents);
router.get('/all', getAllStudents);

router.get('/export', exportStudents);

router.get('/:id', getStudent);
router.post('/', requireRole('admin'), uploadImageMiddleware, createStudent);
router.patch('/:id', requireRole('admin'), uploadImageMiddleware, updateStudent);
router.delete('/:id', requireRole('admin'), deleteStudent);

export default router;