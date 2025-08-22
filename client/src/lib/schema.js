import { z } from 'zod'

export const parentSchema = z.object({
  name: z.string().min(2,'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7,'Phone required'),
  address: z.string().min(4,'Address required'),
  studyPlan: z.enum(['STEM','Humanities','Arts','General'], { required_error:'Select a study plan' })
})

export const childrenCountSchema = z.object({
  childrenCount: z.number().min(0).max(10)
})

export const childSchema = z.object({
  name: z.string().min(1,'Child name required'),
  age: z.number().min(1).max(20),
  grade: z.string().min(1,'Grade required')
})
