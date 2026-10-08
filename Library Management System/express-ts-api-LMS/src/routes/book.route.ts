import { Router } from 'express';
import { validate, validateQuery } from '../middlewares/schema.middleware.js';
import { createBookSchema, updateBookSchema, bookQuerySchema } from '../schema/book.schema.js';
import { getBooks, getBook, createBook, updateBook, deleteBook, getAllBooks } from '../controllers/book.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(bookQuerySchema), getBooks);
router.get('/all', getAllBooks);
router.get('/:id', getBook);
router.post('/', validate(createBookSchema), createBook);
router.patch('/:id', validate(updateBookSchema), updateBook);
router.delete('/:id', deleteBook);

export default router;