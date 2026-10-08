import z from "zod";

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
});

export type AddBook = z.infer<typeof addBookSchema>;

export const editBookSchema = z.object({
  title: z.string().min(2, "Book Title must be at least 2 characters").max(100),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100),
  isbn: z.string().min(10).max(13),
});

export type EditBook = z.infer<typeof editBookSchema>;

export type BooksQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy?: string | null;
  order?: "asc" | "desc";
};

// --------------------------------------------------------------------------------------------------------------------------------------

export const studentSchema = z.object({
  id: z.number(),
  title: z.string(),
  age: z.number(),
});

export type Student = z.infer<typeof studentSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  address: z.object({
    city: z.string(),
  }),
});

export type User = z.infer<typeof userSchema>;

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;

export type StudentsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sort?: string | null;
  order?: "asc" | "desc";
};

// ---------------------------------------------------------------------------------------------------------------------

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
};
