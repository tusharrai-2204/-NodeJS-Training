import type { Request, Response } from "express";
import * as studentService from "../services/student.service.js";
import { BadRequestError } from "../utils/AppError.js";
import type { CreateStudentSchema, StudentQuerySchema, UpdateStudentSchema } from "../schema/student.schema.js";

export const getStudents = async (_req: Request, res: Response) => {
  const query = res.locals.query as StudentQuerySchema;
  const result = await studentService.listStudents(query);

  res.status(200).json({
    success: true,
    data: result.students,
    meta: result.meta
  });
};

export const getAllStudents = async (_req: Request, res: Response) => {
  const students = await studentService.getAllStudents();
  res.status(200).json({ success: true, data: students });
};

export const getStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id as string, 10);

  if (isNaN(studentId)) {
    throw new BadRequestError('Invalid Student ID');
  }

  const student = await studentService.getStudent(studentId);

  res.status(200).json({
    success: true,
    data: student
  });
};

export const createStudent = async (req: Request, res: Response) => {
  const input = req.body as CreateStudentSchema;
  const student = await studentService.addStudent(input);

  res.status(201).json({
    success: true,
    data: student
  });
};

export const updateStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id as string, 10);
  if (isNaN(studentId)) {
    throw new BadRequestError('Invalid Student ID');
  }
  
  const input = req.body as UpdateStudentSchema;
  const updatedStudent = await studentService.editStudent(studentId, input);

  res.status(200).json({
    success: true,
    data: updatedStudent
  });
};

export const deleteStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id as string, 10);
  if (isNaN(studentId)) {
    throw new BadRequestError('Invalid Student ID');
  }
  
  await studentService.removeStudent(studentId);

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully'
  });
}