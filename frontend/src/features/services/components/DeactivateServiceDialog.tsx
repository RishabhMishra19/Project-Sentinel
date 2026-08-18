import { ConfirmMutationDialog } from "../../../shared/ui";
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

  return (
    <ConfirmMutationDialog
      open={open}
      item={service}
      title="Deactivate service"
      onClose={onClose}
      mutation={deleteMutation}
      getVariables={(item) => item.id}
      confirmLabel="Deactivate"
      confirmingLabel="Deactivating…"
      message={(item) => (
        <>
          Deactivate <span className="font-medium text-foreground">{item.name}</span>? The service
          will be marked inactive.
        </>
      )}
    />
  );
};
