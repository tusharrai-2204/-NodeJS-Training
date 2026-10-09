export interface Book {
  id: number,
  book_name: string,
  author_name: string,
  isbn: string,
  file_id: number | null,
  created_at: Date,
  modified_at: Date
};

export interface BookResponse {
  id: number,
  title: string,
  author: string,
  isbn: string,
  file_url: string | null,
  created_at: Date,
  modified_at: Date
};

export type CreateBookInput = Omit<Book, 'id' | 'created_at' | 'modified_at'>;
export type UpdateBookInput = Partial<CreateBookInput>;

export type BookQueryParams = {
  page: number,
  pageSize: number,
  search: string,
  sortBy: string | null,
  order: 'asc' | 'desc'
};