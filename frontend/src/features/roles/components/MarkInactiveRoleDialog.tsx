import { ConfirmMutationDialog } from "../../../shared/ui";
import type { RoleResponse } from "../dto/response/role.response";
import { useMarkRoleInactive } from "../hooks/useRoles";

type MarkInactiveRoleDialogProps = {
  open: boolean;
  role: RoleResponse | null;
  onClose: () => void;
};

export const MarkInactiveRoleDialog = ({ open, role, onClose }: MarkInactiveRoleDialogProps) => {
  const inactiveMutation = useMarkRoleInactive();

  return (
    <ConfirmMutationDialog
      open={open}
      item={role}
      title="Deactivate role"
      onClose={onClose}
      mutation={inactiveMutation}
      getVariables={(item) => item.id}
      confirmLabel="Deactivate"
      confirmingLabel="Deactivating…"
      message={(item) => (
        <>
          Deactivate <span className="font-medium text-foreground">{item.name}</span>? It will no
          longer be assignable to users.
        </>
      )}
    />
  );
};
