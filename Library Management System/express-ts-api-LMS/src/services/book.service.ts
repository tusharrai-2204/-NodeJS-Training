import type { BookQuerySchema, CreateBookSchema, UpdateBookSchema } from "../schema/book.schema.js";
import * as bookRepo from '../repositories/book.repo.js';

// Books Listing
export const listBooks = async (query: BookQuerySchema) => {
  const { books, total } = await bookRepo.getBooks({
    page: query.page,
    pageSize: query.pageSize,
    search: query.search,
    sortBy: query.sortBy ?? null,
    order: query.order
  });

  return {
    books,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    }
  };
};

// Get Book by id
export const getBook = async (id: number) => {
  const book = await bookRepo.findBookById(id);

  if (!book) {
    throw new Error('Book Not Found');
  }

  return book;
};

// Create a new book 
export const addBook = async (input: CreateBookSchema) => {
  const existingBook = await bookRepo.findBookByIsbn(input.isbn);
  if (existingBook) {
    throw new Error('A Book already exists with this ISBN');
  }

  const bookId = await bookRepo.createBook({
    isbn: input.isbn,
    book_name: input.title,
    author_name: input.author
  });

  return await bookRepo.findBookById(bookId);
};

// Edit any book 
export const editBook = async (id: number, input: UpdateBookSchema) => {
  const existingBook = await bookRepo.findBookById(id);

  if (!existingBook) {
    throw new Error('Book not found');
  }

  const bookUpdated = await bookRepo.updateBook(id, {
    book_name: input.title,
    author_name: input.author,
    isbn: input.isbn
  });

  if (!bookUpdated) {
    throw new Error('Something went wrong!');
  }

  return await bookRepo.findBookById(id);
};

// Delete any book 
export const removeBook = async (id: number) => {
  const existingBook = await bookRepo.findBookById(id);
  if (!existingBook) {
    throw new Error('Book not found');
  }
  
  const bookDeleted = await bookRepo.deleteBook(id);

  if (!bookDeleted) {
    throw new Error('Something went wrong');
  }
}