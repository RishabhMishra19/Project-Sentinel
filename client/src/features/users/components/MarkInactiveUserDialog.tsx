import { ModalConfirmLayout } from "../../../shared/ui";
import type { UserResponse } from "../dto/response/user.response";
import { useMarkUserInactive } from "../hooks/useUsers";

type MarkInactiveUserDialogProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const MarkInactiveUserDialog = ({ open, user, onClose }: MarkInactiveUserDialogProps) => {
  const inactiveMutation = useMarkUserInactive();

  if (!open || !user) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Mark user inactive"
      onClose={onClose}
      onConfirm={() => {
        inactiveMutation.mutate(user.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={inactiveMutation.isPending ? "Marking…" : "Mark inactive"}
      confirmDisabled={inactiveMutation.isPending}
    >
      <p className="text-sm text-muted">
        Mark <span className="font-medium text-foreground">{user.displayName}</span> ({user.email})
        inactive? They will no longer be able to sign in.
      </p>
    </ModalConfirmLayout>
  );
};
