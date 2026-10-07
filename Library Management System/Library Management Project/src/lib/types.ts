import z from "zod";

export const bookSchema = z.object({
  id: z.number().positive("Book ID must be a positive number"),
  title: z.string().min(2, "Book Title must be at least 2 characters").max(200, "Book Title cannot be more than 200 characters"),
  author: z.string().min(2, "Book author name must be at least 2 characters")
});

export type Book = z.infer<typeof bookSchema>;

export const addBookSchema = z.object({
  title: z.string().min(2, "Book Title must be at least 2 characters").max(200, "Book Title cannot be more than 200 characters"),
  author: z.string().min(2, "Book author name must be at least 2 characters")
});

export type AddBook = z.infer<typeof addBookSchema>;

export const studentSchema = z.object({
  id: z.number(),
  title: z.string(),
  age: z.number()
});

export type Student = z.infer<typeof studentSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  address: z.object({
    city: z.string(),
  })
});

export type User = z.infer<typeof userSchema>;

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
});

export type Post = z.infer<typeof postSchema>;

export type BooksQueryParams = {
  page: number,
  pageSize: number,
  search: string,
  sort?: string | null,
  order?: 'asc' | 'desc'
}

export type StudentsQueryParams = {
  page: number,
  pageSize: number,
  search: string,
  sort?: string | null,
  order?: 'asc' | 'desc'
}

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
  id: number,
  email: string,
  first_name: string,
  last_name: string
};