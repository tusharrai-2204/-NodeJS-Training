import z from "zod";

// -------------------- Books related types and schemas --------------------------
export const bookSchema = z.object({
  id: z.number().positive("Book ID must be a positive number"),
  title: z
    .string()
    .min(2, "Book Title must be at least 2 characters")
    .max(100, "Book Title cannot be more than 100 characters"),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name cannot be more than 100 characters"),
  isbn: z.string().min(10).max(13),
  file_url: z.url().optional().nullable(),
  created_at: z.string(),
  modified_at: z.string(),
});

export type Book = z.infer<typeof bookSchema>;

export const addBookSchema = z.object({
  title: z
    .string()
    .min(2, "Book Title must be at least 2 characters")
    .max(100, "Book Title cannot be more than 100 characters"),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name cannot be more than 100 characters"),
  isbn: z
    .string()
    .transform((val) => val.replace(/-/g, ""))
    .refine(
      (val) => val.length === 10 || val.length === 13,
      "ISBN must be 10 or 13 digits",
    )
    .refine((val) => /^[0-9X]+$/i.test(val), "ISBN must contain only digits"),
  file_id: z.number().int().positive().optional().nullable()
});

export type AddBook = z.infer<typeof addBookSchema>;

export const editBookSchema = z.object({
  title: z.string().min(2, "Book Title must be at least 2 characters").max(100),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100),
  isbn: z.string().min(10).max(13),
  file_id: z.number().int().positive().optional().nullable()
});

export type EditBook = z.infer<typeof editBookSchema>;

export type BooksQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string | null;
  order?: "asc" | "desc";
};

// -------------  Student related types and schemas    ---------------------------------

export type Student = {
  id: number;
  student_name: string;
  roll_no: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  created_at: Date;
  modified_at: Date;
};

export type StudentDropDownItem = {
  id: number;
  student_name: string;
};

export const addStudentSchema = z.object({
  student_name: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Student name cannot exceed 100 characters"),
  roll_no: z
    .string()
    .min(1, "Roll number is required")
    .max(50, "Roll number cannot exceed 50 characters"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number"),
  country: z.string().min(1, "Country is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  city: z.string().min(1, "City is required").max(100),
});

export type AddStudent = z.infer<typeof addStudentSchema>;

export const editStudentSchema = addStudentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type EditStudent = z.infer<typeof editStudentSchema>;

export type StudentsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string | null;
  order?: 'asc' | 'desc';
};

// ----------- book issue related types and schemas  ---------------

export type Issue = {
  id: number;
  book_id: number;
  book_title: string;
  student_id: number;
  student_name: string;
  issued_at: string;
  return_date: string | null;
  status: 'issued' | 'returned';
};

export type IssueQueryParams = {
  page: number;
  pageSize: number;
  bookId?: number | null;
  studentId?: number | null;
};

// -----------------  auth related types and schemas ---------------------------

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  middle_name: z.string().max(50).optional(),
  last_name: z.string().min(1, "Last name is required").max(50),
  email: z.email("Please enter a valid email").max(100),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type registerForm = z.infer<typeof registerSchema>;
export type loginForm = z.infer<typeof loginSchema>;

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
};
