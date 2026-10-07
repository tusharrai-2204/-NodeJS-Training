import { apiInstance } from "../api";
import type { AddBook, Book, BooksQueryParams } from "../types";

// export const getBooks = async () => (await apiInstance.get('/books')).data;

export const addBook = async (book: AddBook) => (await apiInstance.post('/books', book)).data;

export const updateBook = async (book: Book) => (await apiInstance.put(`/books/${book.id}`, book)).data;

export const deleteBook = async (id: number) => (await apiInstance.delete(`/books/${id}`)).data;

export const getBooks = async ({page, pageSize, search, sort, order }: BooksQueryParams) => {
  const params = new URLSearchParams();

  params.set("_page", String(page));
  params.set("_limit", String(pageSize));
  
  if (search) {
    params.set("q", search);
  }

  if (sort) {
    params.set("_sort", sort);
    params.set("_order", order ?? 'asc');
  }

  const response = await apiInstance.get(`/books?${params.toString()}`);

  return {
    data: response.data as Book[],
    total: Number(response.headers['x-total-count'] ?? 0)
  };
};