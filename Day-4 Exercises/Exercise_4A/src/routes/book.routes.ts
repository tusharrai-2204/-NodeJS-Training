import express from 'express';
import { createBookController, deleteBookController, getAllBooksController, getBookByIdController, updateBookController } from '../controllers/book.controller';

const router = express.Router();

router.get('/', getAllBooksController);

router.get('/:id', getBookByIdController);

router.post('/', createBookController);

router.put('/:id', updateBookController);

router.delete('/:id', deleteBookController);

export default router;