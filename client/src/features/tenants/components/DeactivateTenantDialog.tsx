import { ModalConfirmLayout } from "../../../shared/ui";
import type { TenantResponse } from "../dto/response/tenant.response";
import { useDeleteTenant } from "../hooks/useTenants";

type DeactivateTenantDialogProps = {
  open: boolean;
  tenant: TenantResponse | null;
  onClose: () => void;
};

export const DeactivateTenantDialog = ({ open, tenant, onClose }: DeactivateTenantDialogProps) => {
  const deleteMutation = useDeleteTenant();

  if (!open || !tenant) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Deactivate tenant"
      onClose={onClose}
      onConfirm={() => {
        deleteMutation.mutate(tenant.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={deleteMutation.isPending ? "Deactivating…" : "Deactivate"}
      confirmDisabled={deleteMutation.isPending}
    >
      <p className="text-sm text-muted">
        Deactivate <span className="font-medium text-foreground">{tenant.name}</span>? The tenant
        will be marked inactive. This can be filtered later, but there is no restore action yet.
      </p>
    </ModalConfirmLayout>
  );
};
