import { z } from "zod";

const nameSlugFields = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, digits, and hyphens"),
};

export const createTenantFormSchema = z.object({
  ...nameSlugFields,
  adminEmail: z
    .string()
    .trim()
    .min(1, "Admin email is required")
    .email("Enter a valid email")
    .max(255, "Email must be at most 255 characters"),
  adminDisplayName: z
    .string()
    .trim()
    .min(1, "Admin display name is required")
    .max(255, "Display name must be at most 255 characters"),
});

export const updateTenantFormSchema = z.object(nameSlugFields);

export type CreateTenantFormValues = z.infer<typeof createTenantFormSchema>;
export type UpdateTenantFormValues = z.infer<typeof updateTenantFormSchema>;
