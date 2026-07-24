import { z } from 'zod'
import { passwordFieldSchema } from '../../../shared/forms/schemas/password'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Enter a valid email')),
  password: passwordFieldSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>
