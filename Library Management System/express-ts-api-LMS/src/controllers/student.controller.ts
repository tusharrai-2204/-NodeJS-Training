import type { Request, Response } from "express";
import * as studentService from "../services/student.service.js";
import { BadRequestError } from "../utils/AppError.js";
import { createStudentSchema, updateStudentSchema, type CreateStudentSchema, type StudentQuerySchema, type UpdateStudentSchema } from "../schema/student.schema.js";

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
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues[0]?.message ?? 'Invalid input');
  }
  
  const student = await studentService.addStudent(parsed.data, req.file);

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
  
  const parsed = updateStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues[0]?.message ?? 'Invalid input');
  }

  const updatedStudent = await studentService.editStudent(studentId, parsed.data, req.file);

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

export const exportStudents = async (req: Request, res: Response) => {
  const format = (req.query.format as string)?.toLowerCase() ?? 'excel';
  const userEmail = req.user!.email;

  const result = await studentService.exportStudents(format, userEmail);

  const contentTypes: Record<string, string> = {
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
  };

  const extensions: Record<string, string> = {
    csv: 'csv',
    excel: 'xlsx',
    pdf: 'pdf'
  };

  const filename = `students_export_${new Date().toISOString().split('T')[0]}.${extensions[format]}`;

  res.setHeader('Content-Type', contentTypes[format]);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('X-Total-Records', result.totalRecords);

  // Send the file buffer directly as the response body
  res.status(200).send(result.buffer);
}