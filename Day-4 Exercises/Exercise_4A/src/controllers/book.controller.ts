import { Request, Response } from "express";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../services/book.service";

export const getAllBooksController = async (req: Request, res: Response) => {
  const books = await getAllBooks();
  res.status(200).json(books);
}

export const getBookByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      message: "Invalid ID"
    });
    return;
  }

  const book = await getBookById(id);

  if(!book) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  res.status(200).json(book);
}

export const createBookController = async (req: Request, res: Response) => {
  const { name, author, price, pages } = req.body;

  if(!name || !author || price === undefined || pages === undefined) {
    res.status(400).json({
      message: "Book name, author, price, pages are required"
    });
    return;
  }

  if (typeof price !== "number" || typeof pages !== "number") {
    res.status(400).json({ message: "price and pages must be numbers" });
    return;
  }

  const book = await createBook({ name, author, price, pages });
  res.status(201).json(book);
}

export const updateBookController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      message: "Invalid ID"
    });
    return;
  }

  const { name, author, price, pages } = req.body;

  if(!name || !author || price === undefined || pages === undefined) {
    res.status(400).json({
      message: "Book name, author, price, pages are required"
    });
    return;
  }

  if (typeof price !== "number" || typeof pages !== "number") {
    res.status(400).json({ message: "price and pages must be numbers" });
    return;
  }

  const updatedBook = await updateBook(id, { name, author, price, pages });

  if(!updatedBook) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  return res.status(200).json(updatedBook);
}

export const deleteBookController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      message: "Invalid ID"
    });
    return;
  }

  const result = await deleteBook(id);

  if(!result) {
    res.status(404).json({
      message: "Book not found!"
    });
    return;
  }

  return res.sendStatus(204);
}