import { z } from "zod";

export const createRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
});

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;

export const updateRoleFormSchema = createRoleFormSchema;

export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;

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
