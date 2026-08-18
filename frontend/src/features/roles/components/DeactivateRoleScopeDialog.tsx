import { ConfirmMutationDialog } from "../../../shared/ui";
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

  return (
    <ConfirmMutationDialog
      open={open && roleId != null}
      item={scope}
      title="Deactivate scope"
      onClose={onClose}
      mutation={deactivateMutation}
      getVariables={(item) => item.id}
      confirmLabel="Deactivate"
      confirmingLabel="Deactivating…"
      zIndex={60}
      message={(item) => (
        <>
          Deactivate{" "}
          <span className="font-medium text-foreground">
            {item.scopeType}: {item.scopeName}
          </span>{" "}
          ({item.permission})? It will no longer grant access.
        </>
      )}
    />
  );
};
