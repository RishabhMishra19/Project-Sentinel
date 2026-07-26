import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceIdFromUrl = searchParams.get("serviceId");

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(serviceIdFromUrl);
  const [createOpen, setCreateOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revokeKey, setRevokeKey] = useState<ServiceApiKeyResponse | null>(null);

  const servicesQuery = useAllServicesQuery(SERVICES_PARAMS);
  const services = servicesQuery.rows;

  useEffect(() => {
    if (services.length === 0) {
      setSelectedServiceId(null);
      return;
    }
    setSelectedServiceId((current) => {
      if (serviceIdFromUrl && services.some((service) => service.id === serviceIdFromUrl)) {
        return serviceIdFromUrl;
      }
      if (current && services.some((service) => service.id === current)) {
        return current;
      }
      return services[0]!.id;
    });
  }, [services, serviceIdFromUrl]);

  const selectedService = services.find((service) => service.id === selectedServiceId) ?? null;
  const productId = selectedService?.productId ?? null;
  const serviceId = selectedService?.id ?? null;

  const onServiceChange = (nextServiceId: string) => {
    setSelectedServiceId(nextServiceId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("serviceId", nextServiceId);
        return next;
      },
      { replace: true },
    );
  };

  const onCreated = (created: ServiceApiKeyCreatedResponse) => {
    setRevealedKey(created.apiKey);
  };

  return (
    <div className="mx-auto flex min-h-64 w-full max-w-6xl flex-col gap-6">
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
          onRevoke={setRevokeKey}
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
            open={revokeKey != null}
            productId={productId}
            serviceId={serviceId}
            apiKey={revokeKey}
            onClose={() => setRevokeKey(null)}
          />
        </>
      ) : null}

      <SecretRevealDialog
        open={revealedKey != null}
        value={revealedKey}
        onClose={() => setRevealedKey(null)}
        title="Your API key"
        description="Copy this key now. For security, it will not be shown again."
        copySuccessMessage="API key copied to clipboard."
        copyErrorMessage="Could not copy API key."
      />
    </div>
  );
};
