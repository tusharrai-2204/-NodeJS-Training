import { BooksModel } from "../models/book.model";
import { Book } from "../types/book";

export const getAllBooks = async (): Promise<Book[]> => {
  return BooksModel.findAll();
}

export const getBookById = async (id: Number): Promise<Book | null> => {
  return BooksModel.findById(id);
}

export const createBook = async (book: Book): Promise<Book> => {
  return BooksModel.create(book);
}

export const updateBook = async (id: number, updatedBook: Book): Promise<Book | null> => {
  return BooksModel.update(id, updatedBook);
}

export const deleteBook = async (id: number): Promise<boolean> => {
  return BooksModel.delete(id);
}