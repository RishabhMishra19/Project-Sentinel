import { z } from 'zod'

export const apiKeyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
})

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>
