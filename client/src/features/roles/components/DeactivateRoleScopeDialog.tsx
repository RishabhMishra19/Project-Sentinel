import { useId } from "react";
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
  const titleId = useId();
  const deactivateMutation = useDeactivateRoleScope(roleId);

  if (!open || !roleId || !scope) {
    return null;
  }

  const onConfirm = () => {
    deactivateMutation.mutate(scope.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 px-4">
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
            Deactivate scope
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
          Deactivate{" "}
          <span className="font-medium text-foreground">
            {scope.scopeType}: {scope.scopeName}
          </span>{" "}
          ({scope.permission})? It will no longer grant access.
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
            disabled={deactivateMutation.isPending}
            className="cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deactivateMutation.isPending ? "Deactivating…" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};
