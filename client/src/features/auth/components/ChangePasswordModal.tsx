import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import { useChangePassword } from "../hooks/useChangePassword";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/changePassword.schema";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const ChangePasswordModal = ({ open, onClose, onSuccess }: ChangePasswordModalProps) => {
  const changePasswordMutation = useChangePassword();
  const { reset: resetMutation } = changePasswordMutation;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<ChangePasswordFormValues>({
    schema: changePasswordSchema,
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    reset();
    resetMutation();
  }, [open, reset, resetMutation]);

  const onSubmit = (data: ChangePasswordFormValues) => {
    const { oldPassword, newPassword } = data;

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Change password"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={changePasswordMutation.isPending ? "Updating…" : "Update password"}
      submitDisabled={changePasswordMutation.isPending}
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Current password"
          type="password"
          autoComplete="current-password"
          error={errors.oldPassword}
          registration={register("oldPassword")}
        />
        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword}
          registration={register("newPassword")}
        />
        <FormField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmNewPassword}
          registration={register("confirmNewPassword")}
        />
      </div>
    </ModalForm>
  );
};
