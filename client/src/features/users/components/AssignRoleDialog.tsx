import { useEffect } from "react";
import { ServerSelectField } from "../../../shared/forms/ServerSelectField";
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
  const rolesQuery = useRolesQuery(open);
  const activeRolesQuery = {
    ...rolesQuery,
    rows: rolesQuery.rows.filter((role) => role.status === "ACTIVE"),
  };

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
      submitDisabled={assignMutation.isPending || activeRolesQuery.rows.length === 0}
    >
      <div className="flex flex-col gap-4">
        <ServerSelectField
          label="Role"
          query={activeRolesQuery}
          toOption={(role) => ({ value: role.id, label: role.name })}
          placeholder="Select a role"
          loadingPlaceholder="Loading roles…"
          emptyPlaceholder="No active roles available"
          emptyMessage="No active roles in this tenant. Create a tenant after Admin seeding is available, or seed roles manually."
          errorMessage="Could not load roles."
          error={errors.roleId}
          {...register("roleId")}
        />
      </div>
    </ModalForm>
  );
};
