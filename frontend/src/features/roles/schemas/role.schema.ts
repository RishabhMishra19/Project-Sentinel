import { z } from "zod";

export const roleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export const createRoleScopeFormSchema = z.object({
  scopeType: z.enum(["PRODUCT", "SERVICE"]),
  scopeId: z.string().uuid("Select a valid resource"),
  permission: z.enum(["ALL", "READ", "READ_AND_WRITE"]),
});

export type CreateRoleScopeFormValues = z.infer<typeof createRoleScopeFormSchema>;

export const updateRoleScopeFormSchema = z.object({
  permission: z.enum(["ALL", "READ", "READ_AND_WRITE"]),
});

export type UpdateRoleScopeFormValues = z.infer<typeof updateRoleScopeFormSchema>;
