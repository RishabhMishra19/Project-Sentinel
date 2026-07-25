import { z } from 'zod'

export const createUserFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email')
    .max(255, 'Email must be at most 255 characters'),
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(255, 'Display name must be at most 255 characters'),
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>

export const updateUserFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(255, 'Display name must be at most 255 characters'),
})

export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>

export const assignRoleFormSchema = z.object({
  roleId: z.string().uuid('Select a role'),
})

export type AssignRoleFormValues = z.infer<typeof assignRoleFormSchema>
