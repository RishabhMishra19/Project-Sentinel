import { ConfirmMutationDialog } from "../../../shared/ui";
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

  return (
    <ConfirmMutationDialog
      open={open}
      item={apiKey}
      title="Revoke API key"
      onClose={onClose}
      mutation={revokeMutation}
      getVariables={(item) => item.id}
      confirmLabel="Revoke"
      confirmingLabel="Revoking…"
      message={(item) => (
        <>
          Revoke <span className="font-medium text-foreground">{item.name}</span>? This cannot be
          undone. Agents using this key will stop authenticating until you create a new key.
        </>
      )}
    />
  );
};
