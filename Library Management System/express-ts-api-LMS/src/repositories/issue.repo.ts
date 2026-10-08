import { type ExecuteValues, type ResultSetHeader, type RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { Issue, IssueQueryParams, IssueResponse } from "../models/issue.model.js";

export const getIssues = async (params: IssueQueryParams): Promise<{ issues: IssueResponse[]; total: number }> => {
    const offset = (params.page - 1) * params.pageSize;

    // Build where condition clause with its placeholder values
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (params.studentId !== null) {
        conditions.push('i.student_id = ?');
        values.push(params.studentId);
    }

    if (params.bookId !== null) {
        conditions.push('i.book_id = ?');
        values.push(params.bookId);
    }

    const whereClause = conditions.length > 0 ? `where  ${conditions.join(' and ')}` : '';

    const [countRows] = await pool.execute<RowDataPacket[]>(
        `select count(*) as total from issues i ${whereClause}`, values as ExecuteValues[]
    );

    const total = (countRows[0] as { total: number }).total;
    const [rows] = await pool.execute<RowDataPacket[]>(
        `select 
        i.id, i.book_id, b.book_name as book_title, i.student_id, s.student_name,
        i.issued_at, i.return_date, i.status 
        from issues i 
        join books b on i.book_id = b.id 
        join students s on i.student_id = s.id 
        ${whereClause}
        order by i.issued_at desc 
        limit ? offset ?`,
        [...values, params.pageSize, offset] as ExecuteValues[]
    );

    return { issues: rows as IssueResponse[], total };
};

export const findIssueById = async (id: number): Promise<Issue | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `select * from issues where id = ?`, [id]
    );

    if(rows.length === 0) return null;
    return rows[0] as Issue;
};

// check if this specified book is already issued to this specific student
export const findActiveIssueByBookAndStudent = async (bookId: number, studentId: number): Promise<Issue | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `select * from issues where book_id = ? and student_id = ? and status = 'issued'`, [bookId, studentId]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0] as Issue;
}

export const createIssue = async (bookId: number, studentId: number): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `insert into issues (book_id, student_id, issued_at, status, created_at, modified_at)
        values (?, ?, NOW(), 'issued', NOW(), NOW())`, [bookId, studentId]
    );

    return result.insertId;
};

export const returnIssue = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `update issues set 
        status = 'returned',
        return_date = NOW(),
        modified_at = NOW()
        where id = ? and status = 'issued'`, [id]
    );

    return result.affectedRows > 0;
}