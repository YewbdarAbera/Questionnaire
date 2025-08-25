import { z } from "zod";

export const parentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().trim().optional().default(""),
  // ⬇️ allow empty / missing
  studyPlan: z.string().trim().optional().default(""),
});
export const childSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(1).max(20).optional(),
  grade: z.string().min(1),
  // ✅ accept zero or more subjects from the UI
  subjects: z
    .array(z.enum(["Math", "Reading/Writing", "Science", "Other"]))
    .optional()
    .default([]),
});

export const submissionSchema = z.object({
  parent: parentSchema,
  children: z.array(childSchema).min(0),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
