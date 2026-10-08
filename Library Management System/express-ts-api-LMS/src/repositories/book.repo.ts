import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type {
  Book,
  BookQueryParams,
  BookResponse,
  CreateBookInput,
  UpdateBookInput,
} from "../models/book.model.js";

// Map DB response with API response
const toBookResponse = (book: Book): BookResponse => {
  return {
    id: book.id,
    title: book.book_name,
    author: book.author_name,
    isbn: book.isbn,
    created_at: book.created_at,
    modified_at: book.modified_at,
  };
};

const SORT_COLUMN_MAP: Record<string, string> = {
  title: "book_name",
  author: "author_name",
  isbn: "isbn",
  created_at: "created_at",
};

export const getBooks = async (
  params: BookQueryParams,
): Promise<{ books: BookResponse[]; total: number }> => {
  const offset = (params.page - 1) * params.pageSize;
  const searchTerm = `%${params.search}%`;
  const sortColumn = params.sortBy
    ? (SORT_COLUMN_MAP[params.sortBy] ?? "created_at")
    : "created_at";
  const sortOrder = params.order === "desc" ? "DESC" : "ASC";

  const [countRows] = await pool.execute<RowDataPacket[]>(
    `select count(*) as total from books where book_name like ? or author_name like ? or isbn like ?`,
    [searchTerm, searchTerm, searchTerm],
  );
  const total = (countRows[0] as { total: number }).total;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from books
    where book_name like ? or author_name like ? or isbn like ?
    order by ${sortColumn} ${sortOrder}
    limit ? offset ?`,
    [searchTerm, searchTerm, searchTerm, params.pageSize, offset],
  );

  return {
    books: (rows as Book[]).map(toBookResponse),
    total,
  };
};

export const findBookById = async (
  id: number,
): Promise<BookResponse | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from books where id = ?`,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return toBookResponse(rows[0] as Book);
};

export const findBookByIsbn = async (
  isbn: string,
): Promise<BookResponse | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from books where isbn = ?`,
    [isbn],
  );

  if (rows.length === 0) {
    return null;
  }

  return toBookResponse(rows[0] as Book);
};

export const createBook = async (data: CreateBookInput): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `insert into books (book_name, author_name, isbn, created_at, modified_at) 
    values (?, ?, ?, NOW(), NOW())`, [data.book_name, data.author_name, data.isbn]
  );

  return result.insertId;
};

export const updateBook = async (id: number, data: UpdateBookInput): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `update books set 
    book_name = coalesce(?, book_name),
    author_name = coalesce(?, author_name),
    isbn = coalesce(?, isbn),
    modified_at = NOW()
    where id = ?`, [data.book_name ?? null, data.author_name ?? null, data.isbn ?? null, id]
  );

  return result.affectedRows > 0;
};

export const deleteBook = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `delete from books where id = ?`, [id]
  );

  return result.affectedRows > 0;
};

export const getAllBooks = async (): Promise<{ id: number; title: string; isbn: string }[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, book_name AS title, isbn FROM books ORDER BY book_name ASC`
  );
  return rows as { id: number; title: string; isbn: string }[];
};
