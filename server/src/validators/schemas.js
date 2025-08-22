import { z } from 'zod'

export const parentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(4),
  studyPlan: z.enum(['STEM','Humanities','Arts','General'])
})

export const childSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(1).max(20),
  grade: z.string().min(1)
})

export const submissionSchema = z.object({
  parent: parentSchema,
  children: z.array(childSchema).min(0)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
