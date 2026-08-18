import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import { useCreateRole } from "../hooks/useRoles";
import { roleFormSchema, type RoleFormValues } from "../schemas/role.schema";

type RoleCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export const RoleCreateModal = ({ open, onClose }: RoleCreateModalProps) => {
  const createMutation = useCreateRole();
  const { reset: resetMutation } = createMutation;

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
    if (!open) {
      return;
    }
    resetMutation();
    reset({ name: "" });
  }, [open, reset, resetMutation]);

  const onSubmit = (data: RoleFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Create role"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={createMutation.isPending ? "Creating…" : "Create role"}
      submitDisabled={createMutation.isPending}
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
