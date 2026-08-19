import { useMemo } from "react";
import type { ListQueryRequest } from "../../../shared/dto/request/listQueryRequest";
import { SelectField } from "../../../shared/forms/SelectField";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { ServiceResponse } from "../../services/dto/response/service.response";
import type { ServiceApiKeyResponse } from "../dto/response/apikey.response";
import { useServiceApiKeysQuery } from "../hooks/useApiKeys";
import { apiKeyColumns, createApiKeyRowActions } from "./apiKeysTableConfig";

const ACTIVE_KEY_CHECK_PARAMS: ListQueryRequest = {
  pageable: { page: 0, size: 1 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

type ApiKeysTableProps = {
  services: ServiceResponse[];
  selectedServiceId?: string | null;
  onServiceChange: (serviceId: string) => void;
  productId: string | null;
  serviceId: string | null;
  onCreate: () => void;
  onRevoke: (key: ServiceApiKeyResponse) => void;
};

export const ApiKeysTable = ({
  services,
  selectedServiceId,
  onServiceChange,
  productId,
  serviceId,
  onCreate,
  onRevoke,
}: ApiKeysTableProps) => {
  const effectiveProductId = productId ?? undefined;
  const effectiveServiceId = serviceId ?? undefined;

  const rowActions = useMemo(() => createApiKeyRowActions({ onRevoke }), [onRevoke]);

  const activeCheck = useServiceApiKeysQuery(
    effectiveProductId,
    effectiveServiceId,
    ACTIVE_KEY_CHECK_PARAMS,
  );
  const hasActiveKey = activeCheck.totalElements > 0;

  const emptyMessage = !effectiveServiceId
    ? services.length === 0
      ? "Create a service before managing API keys"
      : "Select a service to view its API keys"
    : "No API keys yet";

  const { listQueryRequest, bindPage } = useDataTable({
    columns: apiKeyColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions: effectiveServiceId ? rowActions : [],
    toolbarActions: (
      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          className="min-w-[12rem]"
          value={selectedServiceId ?? ""}
          onChange={(event) => onServiceChange(event.target.value)}
          aria-label="Filter API keys by service"
          emptyPlaceholder="No services"
          options={services.map((service) => ({
            value: service.id,
            label: `${service.productName} / ${service.name}`,
          }))}
        />

        <button
          type="button"
          className={primaryButtonClassName}
          onClick={onCreate}
          disabled={!effectiveServiceId || hasActiveKey || activeCheck.isLoading}
          title={hasActiveKey ? "Revoke the active key before creating a new one" : undefined}
        >
          Create API key
        </button>
      </div>
    ),
    emptyMessage,
    errorMessage: "Could not load API keys",
  });

  const page = useServiceApiKeysQuery(effectiveProductId, effectiveServiceId, listQueryRequest);

  return (
    <DataTable
      {...bindPage({
        rows: effectiveServiceId ? page.rows : [],
        totalElements: effectiveServiceId ? page.totalElements : 0,
        isLoading: effectiveServiceId != null && page.isLoading,
      })}
    />
  );
};
