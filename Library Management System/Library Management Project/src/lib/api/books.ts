import { apiInstance } from "../api";
import type { AddBook, Book, BooksQueryParams, EditBook } from "../types";

export const getBooks = async ({page, pageSize, search, sortBy, order }: BooksQueryParams) => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  
  if (search) params.set("search", search);

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order ?? 'desc');
  }

  const response = await apiInstance.get(`/api/books?${params.toString()}`);

  return {
    data: response.data.data as Book[],
    total: response.data.meta.total as number
  };
};


export const addBook = async (book: AddBook) => {
  const response = await apiInstance.post('/api/books', book);
  return response.data.data as Book;
}

export const updateBook = async (book: EditBook & { id: number}) => {
  const response = await apiInstance.patch(`/api/books/${book.id}`, {
    title: book.title,
    author: book.author,
    isbn: book.isbn
  })
  return response.data.data as Book;
}

export const deleteBook = async (id: number) => {
  const response = await apiInstance.delete(`/api/books/${id}`);
  return response.data;
}