import { useState } from "react";
import { useModalState } from "../../../shared/hooks/useModalState";
import { useUrlSyncedSelection } from "../../../shared/hooks/useUrlSyncedSelection";
import { PageContent } from "../../../shared/layout/PageContent";
import { QueryGate, SecretRevealDialog } from "../../../shared/ui";
import { useAllServicesQuery } from "../../services/hooks/useServices";
import type {
  ServiceApiKeyCreatedResponse,
  ServiceApiKeyResponse,
} from "../dto/response/apikey.response";
import { ApiKeyFormModal } from "../components/ApiKeyFormModal";
import { ApiKeysTable } from "../components/ApiKeysTable";
import { RevokeApiKeyDialog } from "../components/RevokeApiKeyDialog";

const SERVICES_PARAMS = {
  pageable: { page: 0, size: 100 },
};

export const ApiKeysPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const revealedKey = useModalState<string>();
  const revoke = useModalState<ServiceApiKeyResponse>();

  const servicesQuery = useAllServicesQuery(SERVICES_PARAMS);
  const services = servicesQuery.rows;
  const { selectedId: selectedServiceId, onChange: onServiceChange } = useUrlSyncedSelection({
    paramKey: "serviceId",
    items: services,
  });

  const selectedService = services.find((service) => service.id === selectedServiceId) ?? null;
  const productId = selectedService?.productId ?? null;
  const serviceId = selectedService?.id ?? null;

  const onCreated = (created: ServiceApiKeyCreatedResponse) => {
    revealedKey.show(created.apiKey);
  };

  return (
    <PageContent className="min-h-64">
      <QueryGate
        isLoading={servicesQuery.isLoading}
        isError={servicesQuery.isError}
        loadingMessage="Loading services…"
        errorMessage="Could not load services."
      >
        <ApiKeysTable
          key={selectedServiceId ?? "no-service"}
          services={services}
          selectedServiceId={selectedServiceId}
          onServiceChange={onServiceChange}
          productId={productId}
          serviceId={serviceId}
          onCreate={() => setCreateOpen(true)}
          onRevoke={revoke.show}
        />
      </QueryGate>

      {productId && serviceId ? (
        <>
          <ApiKeyFormModal
            open={createOpen}
            productId={productId}
            serviceId={serviceId}
            onClose={() => setCreateOpen(false)}
            onCreated={onCreated}
          />

          <RevokeApiKeyDialog
            open={revoke.open}
            productId={productId}
            serviceId={serviceId}
            apiKey={revoke.item}
            onClose={revoke.close}
          />
        </>
      ) : null}

      <SecretRevealDialog
        open={revealedKey.open}
        value={revealedKey.item}
        onClose={revealedKey.close}
        title="Your API key"
        description="Copy this key now. For security, it will not be shown again."
        copySuccessMessage="API key copied to clipboard."
        copyErrorMessage="Could not copy API key."
      />
    </PageContent>
  );
};
