import { z } from 'zod'
import { passwordFieldSchema } from '../../../shared/forms/schemas/password'

export const changePasswordSchema = z
  .object({
    oldPassword: passwordFieldSchema,
    newPassword: passwordFieldSchema,
    confirmNewPassword: passwordFieldSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
