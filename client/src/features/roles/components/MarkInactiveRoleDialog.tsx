import { ModalConfirmLayout } from "../../../shared/ui";
import type { RoleResponse } from "../dto/response/role.response";
import { useMarkRoleInactive } from "../hooks/useRoles";

type MarkInactiveRoleDialogProps = {
  open: boolean;
  role: RoleResponse | null;
  onClose: () => void;
};

export const MarkInactiveRoleDialog = ({ open, role, onClose }: MarkInactiveRoleDialogProps) => {
  const inactiveMutation = useMarkRoleInactive();

  if (!open || !role) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Deactivate role"
      onClose={onClose}
      onConfirm={() => {
        inactiveMutation.mutate(role.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={inactiveMutation.isPending ? "Deactivating…" : "Deactivate"}
      confirmDisabled={inactiveMutation.isPending}
    >
      <p className="text-sm text-muted">
        Deactivate <span className="font-medium text-foreground">{role.name}</span>? It will no
        longer be assignable to users.
      </p>
    </ModalConfirmLayout>
  );
};
