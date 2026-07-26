import { useEffect } from "react";
import { SelectField } from "../../../shared/forms/SelectField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { RoleScopeResponse } from "../dto/response/role.response";
import { useUpdateRoleScope } from "../hooks/useRoles";
import { updateRoleScopeFormSchema, type UpdateRoleScopeFormValues } from "../schemas/role.schema";

const PERMISSION_OPTIONS = [
  { value: "READ", label: "READ" },
  { value: "READ_AND_WRITE", label: "READ_AND_WRITE" },
  { value: "ALL", label: "ALL" },
] as const;

type RoleScopeEditModalProps = {
  open: boolean;
  roleId: string | null;
  scope: RoleScopeResponse | null;
  onClose: () => void;
};

export const RoleScopeEditModal = ({ open, roleId, scope, onClose }: RoleScopeEditModalProps) => {
  const updateMutation = useUpdateRoleScope(roleId);
  const { reset: resetMutation } = updateMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateRoleScopeFormValues>({
    schema: updateRoleScopeFormSchema,
    defaultValues: { permission: "READ" },
  });

  useEffect(() => {
    if (!open || !scope) {
      return;
    }
    resetMutation();
    reset({ permission: scope.permission });
  }, [open, scope, reset, resetMutation]);

  if (!open || !roleId || !scope) {
    return null;
  }

  return (
    <ModalForm
      title="Edit permission"
      description={`${scope.scopeType}: ${scope.scopeName}`}
      onClose={onClose}
      onSubmit={handleSubmit((data) => {
        updateMutation.mutate(
          { scopeId: scope.id, payload: data },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      })}
      submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
      submitDisabled={updateMutation.isPending}
      zIndex={60}
    >
      <SelectField
        label="Permission"
        options={PERMISSION_OPTIONS}
        error={errors.permission}
        {...register("permission")}
      />

    </ModalForm>
  );
};
