import { ConfirmMutationDialog } from "../../../shared/ui";
import type { TenantResponse } from "../dto/response/tenant.response";
import { useDeleteTenant } from "../hooks/useTenants";

type DeactivateTenantDialogProps = {
  open: boolean;
  tenant: TenantResponse | null;
  onClose: () => void;
};

export const DeactivateTenantDialog = ({ open, tenant, onClose }: DeactivateTenantDialogProps) => {
  const deleteMutation = useDeleteTenant();

  return (
    <ConfirmMutationDialog
      open={open}
      item={tenant}
      title="Deactivate tenant"
      onClose={onClose}
      mutation={deleteMutation}
      getVariables={(item) => item.id}
      confirmLabel="Deactivate"
      confirmingLabel="Deactivating…"
      message={(item) => (
        <>
          Deactivate <span className="font-medium text-foreground">{item.name}</span>? The tenant
          will be marked inactive. This can be filtered later, but there is no restore action yet.
        </>
      )}
    />
  );
};
