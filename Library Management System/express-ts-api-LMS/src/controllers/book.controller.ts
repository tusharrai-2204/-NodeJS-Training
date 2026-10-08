import type { Request, Response } from "express";
import type { BookQuerySchema, CreateBookSchema, UpdateBookSchema } from "../schema/book.schema.js";
import * as bookService from "../services/book.service.js";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as BookQuerySchema;
    const result = await bookService.listBooks(query);

    res.status(200).json({
      success: true,
      data: result.books,
      meta: result.meta
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch books';
    res.status(500).json({ success: false, message });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string, 10);

    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Book ID'
      });
    }

    const book = await bookService.getBook(bookId);

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch book';
    res.status(404).json({ success: false, message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const input = req.body as CreateBookSchema;
    const book = await bookService.addBook(input);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add book';
    res.status(400).json({ success:false, message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string, 10);
    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Book ID'
      });
    }
    
    const input = req.body as UpdateBookSchema;
    const updatedBook = await bookService.editBook(bookId, input);

    res.status(201).json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update book';
    res.status(400).json({ success:false, message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string, 10);
    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Book ID'
      });
    }
    
    await bookService.removeBook(bookId);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete book';
    res.status(400).json({ success:false, message });
  }
}