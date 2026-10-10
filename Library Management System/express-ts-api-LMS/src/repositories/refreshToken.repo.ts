import { type RowDataPacket, type ResultSetHeader } from "mysql2"
import pool from "../config/db.js"

export const saveRefreshToken = async (
    userId: number,
    tokenHash: string,
    expiresAt: Date
): Promise<void> => {
    await pool.execute<ResultSetHeader>(
        `insert into refresh_tokens 
        (user_id, token_hash, expires_at)
        values (?, ?, ?)`, [userId, tokenHash, expiresAt]
    );
};

export const findRefreshToken = async (tokenHash: string) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `select * from refresh_tokens
        where token_hash = ? and expires_at > NOW()`, [tokenHash]
    );

    if (rows.length === 0) return null;

    return rows[0] as { id: number; user_id: number; token_hash: string; expires_at: Date };
};

export const deleteRefreshToken = async (tokenHash: string): Promise<void> => {
    await pool.execute(
        `delete from refresh_tokens
        where token_hash = ?`, [tokenHash]
    );
};

export const deleteAllUserRefreshTokens = async (userId: number): Promise<void> => {
    await pool.execute(
        `delete from refresh_tokens
        where user_id = ?`, [userId]
    );
};