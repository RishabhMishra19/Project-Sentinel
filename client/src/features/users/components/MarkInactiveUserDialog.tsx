import { useId } from "react";
import type { UserResponse } from "../dto/response/user.response";
import { useMarkUserInactive } from "../hooks/useUsers";

type MarkInactiveUserDialogProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const MarkInactiveUserDialog = ({ open, user, onClose }: MarkInactiveUserDialogProps) => {
  const titleId = useId();
  const inactiveMutation = useMarkUserInactive();

  if (!open || !user) {
    return null;
  }

  const onConfirm = () => {
    inactiveMutation.mutate(user.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
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
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">
            Mark user inactive
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <p className="text-sm text-muted">
          Mark <span className="font-medium text-foreground">{user.displayName}</span> ({user.email}
          ) inactive? They will no longer be able to sign in.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={inactiveMutation.isPending}
            className="cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inactiveMutation.isPending ? "Marking…" : "Mark inactive"}
          </button>
        </div>
      </div>
    </div>
  );
};
