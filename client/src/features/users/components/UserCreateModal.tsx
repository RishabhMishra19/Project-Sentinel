import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { CreateUserResponse } from "../dto/response/user.response";
import { useCreateUser } from "../hooks/useUsers";
import { createUserFormSchema, type CreateUserFormValues } from "../schemas/user.schema";

type UserCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (created: CreateUserResponse) => void;
};

export const UserCreateModal = ({ open, onClose, onCreated }: UserCreateModalProps) => {
  const createMutation = useCreateUser();
  const { reset: resetMutation } = createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<CreateUserFormValues>({
    schema: createUserFormSchema,
    defaultValues: { email: "", displayName: "" },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    resetMutation();
    reset({ email: "", displayName: "" });
  }, [open, reset, resetMutation]);

  const onSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (created) => {
        onClose();
        onCreated(created);
      },
    });
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Create user"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={createMutation.isPending ? "Creating…" : "Create user"}
      submitDisabled={createMutation.isPending}
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Email"
          type="email"
          autoComplete="off"
          error={errors.email}
          registration={register("email")}
        />
        <FormField
          label="Display name"
          type="text"
          autoComplete="off"
          error={errors.displayName}
          registration={register("displayName")}
        />
      </div>
    </ModalForm>
  );
};
