import { ModalConfirmLayout } from "../../../shared/ui";
import type { RoleScopeResponse } from "../dto/response/role.response";
import { useDeactivateRoleScope } from "../hooks/useRoles";

type DeactivateRoleScopeDialogProps = {
  open: boolean;
  roleId: string | null;
  scope: RoleScopeResponse | null;
  onClose: () => void;
};

export const DeactivateRoleScopeDialog = ({
  open,
  roleId,
  scope,
  onClose,
}: DeactivateRoleScopeDialogProps) => {
  const deactivateMutation = useDeactivateRoleScope(roleId);

  if (!open || !roleId || !scope) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Deactivate scope"
      onClose={onClose}
      onConfirm={() => {
        deactivateMutation.mutate(scope.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={deactivateMutation.isPending ? "Deactivating…" : "Deactivate"}
      confirmDisabled={deactivateMutation.isPending}
      zIndex={60}
    >
      <p className="text-sm text-muted">
        Deactivate{" "}
        <span className="font-medium text-foreground">
          {scope.scopeType}: {scope.scopeName}
        </span>{" "}
        ({scope.permission})? It will no longer grant access.
      </p>
    </ModalConfirmLayout>
  );
};
