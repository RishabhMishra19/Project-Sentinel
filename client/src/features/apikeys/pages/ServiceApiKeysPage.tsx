import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
import type {
  ServiceApiKeyCreatedResponse,
  ServiceApiKeyResponse,
} from "../dto/response/apikey.response";
import { ApiKeyFormModal } from "../components/ApiKeyFormModal";
import { ApiKeyRevealDialog } from "../components/ApiKeyRevealDialog";
import { ApiKeysTable } from "../components/ApiKeysTable";
import { RevokeApiKeyDialog } from "../components/RevokeApiKeyDialog";

export const ServiceApiKeysPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [createOpen, setCreateOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revokeKey, setRevokeKey] = useState<ServiceApiKeyResponse | null>(null);

  if (!serviceId || !productId) {
    return (
      <div className="mx-auto w-full max-w-6xl text-sm text-muted">
        Service not found.{" "}
        <Link to={`/${ROUTE_PATHS.services}`} className="text-accent underline">
          Back to services
        </Link>
      </div>
    );
  }

  const onCreated = (created: ServiceApiKeyCreatedResponse) => {
    setRevealedKey(created.apiKey);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ApiKeysTable
        productId={productId}
        serviceId={serviceId}
        onCreate={() => setCreateOpen(true)}
        onRevoke={setRevokeKey}
      />

      <ApiKeyFormModal
        open={createOpen}
        productId={productId}
        serviceId={serviceId}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <ApiKeyRevealDialog
        open={revealedKey != null}
        apiKey={revealedKey}
        onClose={() => setRevealedKey(null)}
      />

      <RevokeApiKeyDialog
        open={revokeKey != null}
        productId={productId}
        serviceId={serviceId}
        apiKey={revokeKey}
        onClose={() => setRevokeKey(null)}
      />
    </div>
  );
};
