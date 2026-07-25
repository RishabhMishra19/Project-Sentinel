import { z } from 'zod'

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
