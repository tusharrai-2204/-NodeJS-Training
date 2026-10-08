import type { Request, Response } from "express";
import type { BookQuerySchema, CreateBookSchema, UpdateBookSchema } from "../schema/book.schema.js";
import * as bookService from "../services/book.service.js";
import { BadRequestError } from "../utils/AppError.js";

export const getBooks = async (_req: Request, res: Response) => {
  const query = res.locals.query as unknown as BookQuerySchema;
  const result = await bookService.listBooks(query);

  res.status(200).json({
    success: true,
    data: result.books,
    meta: result.meta
  });
};

export const getBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id as string, 10);

  if (isNaN(bookId)) {
    throw new BadRequestError('Invalid Book ID');
  }

  const book = await bookService.getBook(bookId);

  res.status(200).json({
    success: true,
    data: book
  });
};

export const createBook = async (req: Request, res: Response) => {
  const input = req.body as CreateBookSchema;
  const book = await bookService.addBook(input);

  res.status(201).json({
    success: true,
    data: book
  });
};

export const updateBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id as string, 10);
  if (isNaN(bookId)) {
    throw new BadRequestError('Invalid Book ID');
  }
  
  const input = req.body as UpdateBookSchema;
  const updatedBook = await bookService.editBook(bookId, input);

  res.status(200).json({
    success: true,
    data: updatedBook
  });
};

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id as string, 10);
  if (isNaN(bookId)) {
    throw new BadRequestError('Invalid Book ID');
  }
  
  await bookService.removeBook(bookId);

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully'
  });
}