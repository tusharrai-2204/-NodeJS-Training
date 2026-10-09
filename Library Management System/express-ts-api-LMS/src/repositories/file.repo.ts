import { type RowDataPacket, type ResultSetHeader } from "mysql2";
import pool from "../config/db.js";
import type { CreateFileInput, File } from "../models/file.model.js";

export const createFile = async (file: CreateFileInput): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `insert into files (original_name, cloudinary_public_id, url, mimetype, size, created_at)
        values (?, ?, ?, ?, ?, NOW())`, [file.original_name, file.cloudinary_public_id, file.url, file.mimetype, file.size]
    );
    return result.insertId;
};

export const findFileById = async (id: number): Promise<File | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `select * from files where id = ?`, [id]
    );
    if (rows.length === 0) return null;

    return rows[0] as File;
};

export const deleteFile = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `delete from files where id = ?`, [id]
    );

    return result.affectedRows > 0;
};