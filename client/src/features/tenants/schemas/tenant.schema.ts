import { z } from 'zod'

export const tenantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be at most 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, digits, and hyphens',
    ),
})

export type TenantFormValues = z.infer<typeof tenantFormSchema>
