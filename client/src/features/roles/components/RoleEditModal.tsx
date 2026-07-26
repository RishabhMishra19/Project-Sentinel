import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { RoleResponse } from "../dto/response/role.response";
import { useUpdateRole } from "../hooks/useRoles";
import { roleFormSchema, type RoleFormValues } from "../schemas/role.schema";

type RoleEditModalProps = {
  open: boolean;
  role: RoleResponse | null;
  onClose: () => void;
};

export const RoleEditModal = ({ open, role, onClose }: RoleEditModalProps) => {
  const updateMutation = useUpdateRole();
  const { reset: resetMutation } = updateMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<RoleFormValues>({
    schema: roleFormSchema,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open || !role) {
      return;
    }
    resetMutation();
    reset({ name: role.name });
  }, [open, role, reset, resetMutation]);

  if (!open || !role) {
    return null;
  }

  const onSubmit = (data: RoleFormValues) => {
    updateMutation.mutate(
      { id: role.id, payload: data },
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
      title="Edit role"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
      submitDisabled={updateMutation.isPending}
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          type="text"
          autoComplete="off"
          error={errors.name}
          registration={register("name")}
        />
      </div>
    </ModalForm>
  );
};
