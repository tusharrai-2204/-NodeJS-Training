import z from "zod";

export const createStudentSchema = z.object({
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
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  country: z.string().min(1, "Country is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  city: z.string().min(1, "City is required").max(100),
});

export const updateStudentSchema = z
  .object({
    student_name: z.string().min(2).max(100).optional(),
    roll_no: z.string().min(1).max(50).optional(),
    phone: z
      .string()
      .min(7)
      .max(15)
      .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format")
      .optional(),
    country: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const studentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(200).default(""),
  sortBy: z
    .enum(["student_name", "roll_no", "created_at"])
    .default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>;
export type StudentQuerySchema = z.infer<typeof studentQuerySchema>;