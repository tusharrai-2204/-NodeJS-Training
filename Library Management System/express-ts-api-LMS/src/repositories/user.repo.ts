import pool from "../config/db.js";
import type { CreateUserInput, User } from "../models/user.model.js";
import { type ResultSetHeader, type RowDataPacket } from 'mysql2';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const sql = `select * from users where email = ?`;

  const [rows] = await pool.execute<RowDataPacket[]>(sql, [email]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as User;
}

export const createUser = async (data: CreateUserInput): Promise<number> => {
  const sql = `insert into users (first_name, middle_name, last_name, email, auth_provider, provider_user_id, password, created_at, modified_at) 
  values(?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  const [result] = await pool.query<ResultSetHeader>(sql, [
    data.first_name, 
    data.middle_name ?? null, 
    data.last_name, 
    data.email, 
    data.auth_provider, 
    data.provider_user_id ?? null, 
    data.password ?? null
  ]);

  return result.insertId;
}

export const findUserById = async (id: number): Promise<User | null> => {
  const sql = `select * from users where id = ?`;

  const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as User;
}