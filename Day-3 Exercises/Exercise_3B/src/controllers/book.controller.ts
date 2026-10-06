import { Request, Response } from "express";
import { Book } from "../types/book";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../services/book.service";

export const getAllBooksController = (req: Request, res: Response) => {
  const books = getAllBooks();

  res.status(200).json(books);
}

export const getBookByIdController = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const book = getBookById(id);

  if(!book) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  res.status(200).json(book);
}

export const createBookController = (req: Request, res: Response) => {
  const book = req.body;
  res.status(201).json(createBook(book));
}

export const updateBookController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const book = req.body;
  const updatedBook = updateBook(id, book);

  if(!updatedBook) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  return res.status(200).json(updatedBook);
}

export const deleteBookController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = deleteBook(id);

  if(!result) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  return res.sendStatus(204);
}