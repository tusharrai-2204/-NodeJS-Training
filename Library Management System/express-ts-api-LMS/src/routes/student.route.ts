import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate, validateQuery } from "../middlewares/schema.middleware.js";
import { createStudentSchema, studentQuerySchema, updateStudentSchema } from "../schema/student.schema.js";
import { createStudent, deleteStudent, getAllStudents, getStudent, getStudents, updateStudent } from "../controllers/student.controller.js";

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(studentQuerySchema), getStudents);
router.get('/all', getAllStudents);
router.get('/:id', getStudent);
router.post('/', validate(createStudentSchema), createStudent);
router.patch('/:id', validate(updateStudentSchema), updateStudent);
router.delete('/:id', deleteStudent);

export default router;