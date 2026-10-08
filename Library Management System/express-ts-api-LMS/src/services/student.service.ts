import * as studentRepo from "../repositories/student.repo.js";
import type { CreateStudentSchema, StudentQuerySchema, UpdateStudentSchema } from "../schema/student.schema.js";
import { AppError, ConflictError, NotFoundError } from "../utils/AppError.js";

// Students Listing
export const listStudents = async (query: StudentQuerySchema) => {
  const { students, total } = await studentRepo.getStudents({
    page: query.page,
    pageSize: query.pageSize,
    search: query.search,
    sortBy: query.sortBy ?? null,
    order: query.order
  });

  return {
    students,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    }
  };
};

export const getAllStudents = async () => {
    return studentRepo.getAllStudents();
}

// Get Student by id
export const getStudent = async (id: number) => {
  const student = await studentRepo.findStudentById(id);

  if (!student) {
    throw new NotFoundError('Student Not Found');
  }

  return student;
};

// Create a new student 
export const addStudent = async (input: CreateStudentSchema) => {
  const existingStudent = await studentRepo.findStudentByRollNo(input.roll_no);
  if (existingStudent) {
    throw new ConflictError('A Student already exists with this Roll number');
  }

  const studentId = await studentRepo.createStudent(input);

  return await studentRepo.findStudentById(studentId);
};

// Edit any Student
export const editStudent = async (id: number, input: UpdateStudentSchema) => {
  const existingStudent = await studentRepo.findStudentById(id);

  if (!existingStudent) {
    throw new NotFoundError('Student not found');
  }

  if (input.roll_no && input.roll_no !== existingStudent.roll_no) {
    const conflict = await studentRepo.findStudentByRollNo(input.roll_no);
    if (conflict) throw new ConflictError('A student with this roll number already exists');
  }

  const studentUpdated = await studentRepo.updateStudent(id, input);

  if (!studentUpdated) {
    throw new AppError('Failed to update student', 500);
  }

  return await studentRepo.findStudentById(id);
};

// Delete any student 
export const removeStudent = async (id: number) => {
  const existingStudent = await studentRepo.findStudentById(id);
  if (!existingStudent) {
    throw new NotFoundError('Student not found');
  }
  
  const studentDeleted = await studentRepo.deleteStudent(id);

  if (!studentDeleted) {
    throw new AppError('Failed to delete student', 500);
  }
}