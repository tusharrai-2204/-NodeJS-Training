import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validate, validateQuery } from "../middlewares/schema.middleware.js";
import { createIssueSchema, issueQuerySchema } from "../schema/issue.schema.js";
import { createIssue, getIssues, returnBook } from "../controllers/issue.controller.js";

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(issueQuerySchema), getIssues);
router.post('/', requireRole('admin'), validate(createIssueSchema), createIssue);
router.patch('/:id/return', requireRole('admin'), returnBook);

export default router;