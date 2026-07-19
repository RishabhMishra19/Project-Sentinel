import { z } from "zod";

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
