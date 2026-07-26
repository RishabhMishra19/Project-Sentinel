import { useEffect } from "react";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { UserResponse } from "../dto/response/user.response";
import { useAssignRole, useRolesQuery } from "../hooks/useUsers";
import { assignRoleFormSchema, type AssignRoleFormValues } from "../schemas/user.schema";

type AssignRoleDialogProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const AssignRoleDialog = ({ open, user, onClose }: AssignRoleDialogProps) => {
  const assignMutation = useAssignRole();
  const { reset: resetMutation } = assignMutation;
  const { data: roles = [], isLoading: rolesLoading } = useRolesQuery(open);
  const activeRoles = roles.filter((role) => role.status === "ACTIVE");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<AssignRoleFormValues>({
    schema: assignRoleFormSchema,
    defaultValues: { roleId: "" },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    resetMutation();
    reset({ roleId: "" });
  }, [open, reset, resetMutation]);

  if (!open || !user) {
    return null;
  }

  const onSubmit = (data: AssignRoleFormValues) => {
    assignMutation.mutate(
      {
        id: user.id,
        payload: { roleId: data.roleId },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Assign role"
      description={
        <>
          Assign a role to <span className="font-medium text-foreground">{user.displayName}</span>.
        </>
      }
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={assignMutation.isPending ? "Assigning…" : "Assign role"}
      submitDisabled={assignMutation.isPending || activeRoles.length === 0}
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Role
          <select
            className="rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring"
            disabled={rolesLoading || activeRoles.length === 0}
            {...register("roleId")}
          >
            <option value="">{rolesLoading ? "Loading roles…" : "Select a role"}</option>
            {activeRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId?.message ? (
            <span className="text-sm text-danger">{errors.roleId.message}</span>
          ) : null}
          {!rolesLoading && activeRoles.length === 0 ? (
            <span className="text-sm text-muted">
              No active roles in this tenant. Create a tenant after Admin seeding is available, or
              seed roles manually.
            </span>
          ) : null}
        </label>
      </div>
    </ModalForm>
  );
};
