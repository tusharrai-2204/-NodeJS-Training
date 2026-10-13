import * as studentRepo from "../repositories/student.repo.js";
import type { CreateStudentSchema, StudentQuerySchema, UpdateStudentSchema } from "../schema/student.schema.js";
import { AppError, BadRequestError, ConflictError, NotFoundError } from "../utils/AppError.js";
import { generateCsv, generateExcel, generatePdf } from "../utils/export.util.js";
import { uploadImageToCloudinary, deleteImageByUrl } from "./file.service.js";
import { sendStudentExportEmail } from "./mail.service.js";
import * as userRepo from "../repositories/user.repo.js";
import bcrypt from 'bcrypt';
import pool from "../config/db.js";

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
export const addStudent = async (input: CreateStudentSchema, imageFile?: Express.Multer.File) => {
  const existingStudent = await studentRepo.findStudentByRollNoOrPhone(input.roll_no, input.phone);
  if (existingStudent) {
    throw new ConflictError('A Student already exists with this Roll number or Phone number.');
  }

  let profile_image_url: string | null = null;

  if (imageFile) {
    profile_image_url = await uploadImageToCloudinary(imageFile, 'lms/students');
  }

  const studentId = await studentRepo.createStudent({...input, profile_image_url});

  const hashedPhone = await bcrypt.hash(input.phone, 10);
  await userRepo.createUser({
    first_name: input.student_name,
    middle_name: null,
    last_name: '',
    email: input.roll_no,
    auth_provider: 'local',
    provider_user_id: null,
    role: 'student',
    password: hashedPhone,
    student_id: studentId,
    password_changed: false
  });

  return await studentRepo.findStudentById(studentId);
};

// Edit any Student
export const editStudent = async (id: number, input: UpdateStudentSchema, imageFile?: Express.Multer.File) => {
  const existingStudent = await studentRepo.findStudentById(id);

  if (!existingStudent) {
    throw new NotFoundError('Student not found');
  }

  if ((input.roll_no && input.roll_no !== existingStudent.roll_no) || (input.phone && input.phone !== existingStudent.phone)) {
    const conflict = await studentRepo.findStudentByRollNoOrPhone(input.roll_no ?? null, input.phone ?? null);
    if (conflict) throw new ConflictError('A student with this roll number or phone already exists');
  }

  let profile_image_url: string | undefined = undefined;

  if (imageFile) {
    // delete the existing profile image
    if (existingStudent.profile_image_url) {
      await deleteImageByUrl(existingStudent.profile_image_url);
    }
    profile_image_url = await uploadImageToCloudinary(imageFile, 'lms/students');
  }

  const studentUpdated = await studentRepo.updateStudent(id, {
    ...input,
    ...(profile_image_url !== undefined ? { profile_image_url } : {})
  });

  if (!studentUpdated) {
    throw new AppError('Failed to update student', 500);
  }

  const linkedUser = await userRepo.findUserByStudentId(id);
  if (linkedUser) {
    // If roll_no changed → update users.email
    if (input.roll_no && input.roll_no !== existingStudent.roll_no) {
      await userRepo.updateUserEmail(linkedUser.id, input.roll_no);
    }

    // If phone changed AND student hasn't set their own password yet → re-hash and update
    if (input.phone && input.phone !== existingStudent.phone && !linkedUser.password_changed) {
      const hashedPhone = await bcrypt.hash(input.phone, 10);
      await userRepo.syncUserPassword(linkedUser.id, hashedPhone);
    }
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

  if (existingStudent.profile_image_url) {
    await deleteImageByUrl(existingStudent.profile_image_url);
  }
};

// Export student data 
export const exportStudents = async (format: string, userEmail: string) => {
  const validFormats = ["csv", "excel", "pdf"];
  if (!validFormats.includes(format)) {
    throw new BadRequestError(`Invalid Format. Use: ${validFormats.join(', ')}`);
  }

  const students = await studentRepo.exportAllStudents();

  let fileBuffer: Buffer;
  if (format === 'csv') {
    fileBuffer = generateCsv(students);
  } else if (format === 'excel') {
    fileBuffer = await generateExcel(students);
  } else {
    fileBuffer = await generatePdf(students);
  }

  sendStudentExportEmail(userEmail, format, fileBuffer, students.length)
  .catch(err => console.error(`Failed to send export email: ${err}`));

  return {
    buffer: fileBuffer,
    format, totalRecords: students.length
  }
}