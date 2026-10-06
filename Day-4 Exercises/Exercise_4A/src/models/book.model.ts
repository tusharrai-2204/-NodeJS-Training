import { pool } from "../config/db";
import { Book } from '../types/book';
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class BooksModel {

  static async findAll(): Promise<Book[]> {
    const sql = `select * from books`;
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows as Book[];
  }

  static async findById(id: Number): Promise<Book | null> {
    const sql = `select * from books where id = ?`;
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Book;
  }

  static async create(book: Book): Promise<Book> {
    const sql = `insert into books(name, author, price, pages) values (?, ?, ?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(sql, [book.name, book.author, book.price, book.pages]);

    return (await BooksModel.findById(result.insertId))!;
  }

  static async update(id: number, book: Book): Promise<Book | null> {
    const sql = `update books set name = ?, author = ?, price = ?, pages = ? where id = ?`;
    const [result] = await pool.query<ResultSetHeader>(sql, [book.name, book.author, book.price, book.pages, id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return (await BooksModel.findById(id));
  }

  static async delete(id: number): Promise<boolean> {
    const sql = `delete from books where id = ?`;
    const [result] = await pool.query<ResultSetHeader>(sql, [id]);

    return result.affectedRows > 0;
  }
}