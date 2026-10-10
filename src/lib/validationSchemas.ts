// src/lib/validationSchemas.ts
import { z } from 'zod';

export const baseSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = baseSchema.extend({
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[0-9]/, "Must include number")
    .regex(/[^A-Za-z0-9]/, "Must include special character"),
});
