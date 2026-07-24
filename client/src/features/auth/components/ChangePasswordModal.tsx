import { useEffect, useId, useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "../../../shared/ui/toast";
import { useChangePassword } from "../hooks/useChangePassword";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return "Could not change password. Please try again.";
}

export function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const titleId = useId();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const changePasswordMutation = useChangePassword();
  const { reset: resetMutation } = changePasswordMutation;

  useEffect(() => {
    if (!open) {
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setClientError(null);
    resetMutation();
  }, [open, resetMutation]);

  if (!open) {
    return null;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setClientError(null);

    if (oldPassword.length < 8 || newPassword.length < 8) {
      setClientError("Passwords must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setClientError("New password and confirmation do not match.");
      return;
    }
    if (oldPassword === newPassword) {
      setClientError(
        "New password must be different from the current password.",
      );
      return;
    }

    void toast
      .promise(
        changePasswordMutation.mutateAsync({ oldPassword, newPassword }),
        {
          loading: "Updating password…",
          success: "Password updated successfully.",
          error: (error) => apiErrorMessage(error),
        },
      )
      .unwrap()
      .then(() => {
        onSuccess?.();
        onClose();
      });
  }

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
            className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Current password
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              autoComplete="current-password"
              className="rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Confirm new password
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
            />
          </label>

          {clientError ? (
            <p className="text-sm text-red-600">{clientError}</p>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {changePasswordMutation.isPending ? "Saving…" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
