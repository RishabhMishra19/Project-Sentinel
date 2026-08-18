import { ConfirmMutationDialog } from "../../../shared/ui";
import type { UserResponse } from "../dto/response/user.response";
import { useMarkUserInactive } from "../hooks/useUsers";

type MarkInactiveUserDialogProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const MarkInactiveUserDialog = ({ open, user, onClose }: MarkInactiveUserDialogProps) => {
  const inactiveMutation = useMarkUserInactive();

  return (
    <ConfirmMutationDialog
      open={open}
      item={user}
      title="Mark user inactive"
      onClose={onClose}
      mutation={inactiveMutation}
      getVariables={(item) => item.id}
      confirmLabel="Mark inactive"
      confirmingLabel="Marking…"
      message={(item) => (
        <>
          Mark <span className="font-medium text-foreground">{item.displayName}</span> ({item.email})
          inactive? They will no longer be able to sign in.
        </>
      )}
    />
  );
};
