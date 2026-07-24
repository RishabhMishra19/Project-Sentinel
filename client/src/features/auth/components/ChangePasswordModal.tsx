import { useEffect, useId } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { toast } from "../../../shared/ui/toast";
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

export const ChangePasswordModal = ({
  open,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) => {
  const titleId = useId();
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

  if (!open) {
    return null;
  }

  const onSubmit = (data: ChangePasswordFormValues) => {
    const { oldPassword, newPassword } = data;

    toast.promise(
      changePasswordMutation.mutateAsync({ oldPassword, newPassword }),
      {
        loading: "Updating password…",
        success: () => {
          onSuccess?.();
          onClose();
          return "Password updated successfully.";
        },
        error: (error) =>
          getApiErrorMessage(
            error,
            "Could not change password. Please try again.",
          ),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-slate-900">
            Change password
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changePasswordMutation.isPending
                ? "Updating…"
                : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
