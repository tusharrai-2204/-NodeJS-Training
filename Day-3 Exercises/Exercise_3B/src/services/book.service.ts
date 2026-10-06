import { books } from "../data/books";
import { Book } from "../types/book";

export const getAllBooks = (): Book[] => {
  return books;
}

export const getBookById = (id: Number): Book | undefined => {
  return books.find(book => book.BookId === id);
}

export const createBook = (book: Book): Book => {
  books.push(book);
  return book;
}

export const updateBook = (id: Number, updatedBook: Book): Book | undefined => {
  const index = books.findIndex(book => book.BookId === id);

  if(index == -1) {
    return undefined;
  }

  books[index] = updatedBook;

  return books[index];
}

export const deleteBook = (id: Number): boolean => {
  const index = books.findIndex(book => book.BookId === id);

  if(index == -1) {
    return false;
  }

  books.splice(index, 1);
  return true;
}