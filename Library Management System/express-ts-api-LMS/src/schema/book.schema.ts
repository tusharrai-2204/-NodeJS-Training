import z from "zod";

const isbnSchema = z
  .string()
  .transform((val) => val.replace(/-/g, ""))
  .refine((val) => val.length === 10 || val.length === 13, {
    message: "ISBN must be 10 or 13 digits",
  })
  .refine((val) => /^[0-9X]+$/i.test(val), {
    message: "ISBN must contain only digits (and X for ISBN-10)",
  });

export const createBookSchema = z.object({
  title: z
    .string()
    .min(2, "Book name must be atleast 2 characters")
    .max(100, "Book name cannot have more than 100 characters"),
  author: z
    .string()
    .min(2, "Author name must be atleast 2 characters")
    .max(100, "Author name cannot have more than 100 characters"),
  isbn: isbnSchema,
  file_id: z.number().int().positive().optional().nullable()
});

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .min(2, "Book name must be atleast 2 characters")
      .max(100, "Book name cannot have more than 100 characters")
      .optional(),
    author: z
      .string()
      .min(2, "Author name must be atleast 2 characters")
      .max(100, "Author name cannot have more than 100 characters")
      .optional(),
    isbn: isbnSchema.optional(),
    file_id: z.number().int().positive().optional().nullable()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Atleast one field must be provided for update.",
  });

export const bookQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1),

  pageSize: z.coerce
    .number()
    .int("Page size must be an integer")
    .min(1, "Page size must be at least 1")
    .max(100, "Page size cannot exceed 100")
    .default(10),

  search: z
    .string()
    .max(200, "Search cannot exceed 200 characters")
    .default(""),

  sortBy: z
    .enum(["title", "author", "isbn", "created_at"])
    .default("created_at"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;
export type UpdateBookSchema = z.infer<typeof updateBookSchema>;
export type BookQuerySchema = z.infer<typeof bookQuerySchema>;