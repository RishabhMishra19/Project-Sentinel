import { ModalConfirmLayout } from "../../../shared/ui";
import type { ServiceApiKeyResponse } from "../dto/response/apikey.response";
import { useRevokeServiceApiKey } from "../hooks/useApiKeys";

type RevokeApiKeyDialogProps = {
  open: boolean;
  productId: string;
  serviceId: string;
  apiKey: ServiceApiKeyResponse | null;
  onClose: () => void;
};

export const RevokeApiKeyDialog = ({
  open,
  productId,
  serviceId,
  apiKey,
  onClose,
}: RevokeApiKeyDialogProps) => {
  const revokeMutation = useRevokeServiceApiKey(productId, serviceId);

  if (!open || !apiKey) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Revoke API key"
      onClose={onClose}
      onConfirm={() => {
        revokeMutation.mutate(apiKey.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={revokeMutation.isPending ? "Revoking…" : "Revoke"}
      confirmDisabled={revokeMutation.isPending}
    >
      <p className="text-sm text-muted">
        Revoke <span className="font-medium text-foreground">{apiKey.name}</span>? This cannot be
        undone. Agents using this key will stop authenticating until you create a new key.
      </p>
    </ModalConfirmLayout>
  );
};
