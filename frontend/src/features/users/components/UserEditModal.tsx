import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { UserResponse } from "../dto/response/user.response";
import { useUpdateUser } from "../hooks/useUsers";
import { updateUserFormSchema, type UpdateUserFormValues } from "../schemas/user.schema";

type UserEditModalProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const UserEditModal = ({ open, user, onClose }: UserEditModalProps) => {
  const updateMutation = useUpdateUser();
  const { reset: resetMutation } = updateMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateUserFormValues>({
    schema: updateUserFormSchema,
    defaultValues: { displayName: "" },
  });

  useEffect(() => {
    if (!open || !user) {
      return;
    }
    resetMutation();
    reset({ displayName: user.displayName });
  }, [open, user, reset, resetMutation]);

  if (!open || !user) {
    return null;
  }

  const onSubmit = (data: UpdateUserFormValues) => {
    updateMutation.mutate(
      { id: user.id, payload: data },
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
      title="Edit user"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
      submitDisabled={updateMutation.isPending}
    >
      <div className="flex flex-col gap-4">
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
