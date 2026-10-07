import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name cannot have more than 50 characters"),
  middle_name: z.string().max(50).optional(),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name cannot have more than 50 characters"),
  email: z.email("Invalid email"),
  username: z.string().min(3, "Username must have atleast 3 characters").max(50, "Username cannot have more than 50 characters"),
  password: z.string().min(6, "Password must be atleast 6 characters")
});

export const loginSchema = z.object({
  email: z.email('Invalid email').optional(),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
}).refine(
  (data) => data.email !== undefined || data.username !== undefined,
  { message: 'Either email or username is required' }
);

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;