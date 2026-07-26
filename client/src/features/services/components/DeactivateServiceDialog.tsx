import { ModalConfirmLayout } from "../../../shared/ui";
import type { ServiceResponse } from "../dto/response/service.response";
import { useDeleteService } from "../hooks/useServices";

type DeactivateServiceDialogProps = {
  open: boolean;
  productId: string;
  service: ServiceResponse | null;
  onClose: () => void;
};

export const DeactivateServiceDialog = ({
  open,
  productId,
  service,
  onClose,
}: DeactivateServiceDialogProps) => {
  const deleteMutation = useDeleteService(productId);

  if (!open || !service) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Deactivate service"
      onClose={onClose}
      onConfirm={() => {
        deleteMutation.mutate(service.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={deleteMutation.isPending ? "Deactivating…" : "Deactivate"}
      confirmDisabled={deleteMutation.isPending}
    >
      <p className="text-sm text-muted">
        Deactivate <span className="font-medium text-foreground">{service.name}</span>? The service
        will be marked inactive.
      </p>
    </ModalConfirmLayout>
  );
};
