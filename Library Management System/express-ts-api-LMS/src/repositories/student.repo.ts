import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { CreateStudentInput, Student, StudentQueryParams, UpdateStudentInput } from "../models/student.model.js";

const SORT_COLUMN_MAP: Record<string, string> = {
  student_name: "student_name",
  roll_no: "roll_no",
  created_at: "created_at",
};

export const getStudents = async (
  params: StudentQueryParams,
): Promise<{ students: Student[]; total: number }> => {
  const offset = (params.page - 1) * params.pageSize;
  const searchTerm = `%${params.search}%`;
  const sortColumn = params.sortBy
    ? (SORT_COLUMN_MAP[params.sortBy] ?? "created_at")
    : "created_at";
  const sortOrder = params.order === "desc" ? "DESC" : "ASC";

  const [countRows] = await pool.execute<RowDataPacket[]>(
    `select count(*) as total from students where student_name like ? or roll_no like ? or phone like ?`,
    [searchTerm, searchTerm, searchTerm],
  );
  const total = (countRows[0] as { total: number }).total;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from students
    where student_name like ? or roll_no like ? or phone like ?
    order by ${sortColumn} ${sortOrder}
    limit ? offset ?`,
    [searchTerm, searchTerm, searchTerm, params.pageSize, offset],
  );

  return { students: rows as Student[], total };
};


// get All Students without page limit 
export const getAllStudents = async (): Promise<{ id: number; student_name: string; }[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `select id, student_name from students order by student_name asc`,
  );
  return rows as { id: number; student_name: string; }[];
};

// get student by id
export const findStudentById = async (
  id: number,
): Promise<Student | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from students where id = ?`,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Student;
};

// get student by roll number
export const findStudentByRollNo = async (
  rollNo: string,
): Promise<Student | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `select * from students where roll_no = ?`,
    [rollNo],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Student;
};

// create Student
export const createStudent = async (data: CreateStudentInput): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `insert into students (student_name, roll_no, phone, country, state, city, created_at, modified_at) 
    values (?, ?, ?, ?, ?, ?, NOW(), NOW())`, 
    [data.student_name, data.roll_no, data.phone, data.country, data.state, data.city]
  );

  return result.insertId;
};

export const updateStudent = async (id: number, data: UpdateStudentInput): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `update students set 
    student_name = coalesce(?, student_name),
    roll_no = coalesce(?, roll_no),
    phone = coalesce(?, phone),
    country = coalesce(?, country),
    state = coalesce(?, state),
    city = coalesce(?, city),
    modified_at = NOW()
    where id = ?`, 
    [data.student_name ?? null, data.roll_no ?? null, data.phone ?? null, data.country ?? null, data.state ?? null, data.city ?? null, id]
  );

  return result.affectedRows > 0;
};

export const deleteStudent = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `delete from students where id = ?`, [id]
  );

  return result.affectedRows > 0;
};