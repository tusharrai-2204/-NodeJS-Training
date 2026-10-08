import z from "zod";

export const createIssueSchema = z.object({
  book_id: z
    .number({ error: "Book is required" })
    .int()
    .positive("Invalid Book ID"),
  student_id: z
    .number({ error: "Student is required" })
    .int()
    .positive("Invalid Student ID"),
});

export const issueQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  studentId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .default(null),
  bookId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .default(null),
});

export type CreateIssueSchema = z.infer<typeof createIssueSchema>;
export type IssueQuerySchema = z.infer<typeof issueQuerySchema>;
