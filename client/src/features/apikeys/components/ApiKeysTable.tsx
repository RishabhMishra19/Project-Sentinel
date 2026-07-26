import { useMemo } from "react";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { ServiceApiKeyResponse } from "../dto/response/apikey.response";
import { useServiceApiKeysQuery } from "../hooks/useApiKeys";
import { apiKeyColumns, createApiKeyRowActions } from "./apiKeysTableConfig";

const ACTIVE_KEY_CHECK_PARAMS: ListQueryRequest = {
  pageable: { page: 0, size: 1 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

type ApiKeysTableProps = {
  productId: string;
  serviceId: string;
  onCreate: () => void;
  onRevoke: (key: ServiceApiKeyResponse) => void;
};

export const ApiKeysTable = ({ productId, serviceId, onCreate, onRevoke }: ApiKeysTableProps) => {
  const rowActions = useMemo(() => createApiKeyRowActions({ onRevoke }), [onRevoke]);

  const activeCheck = useServiceApiKeysQuery(productId, serviceId, ACTIVE_KEY_CHECK_PARAMS);
  const hasActiveKey = activeCheck.totalElements > 0;

  const { listQueryRequest, bindPage } = useDataTable({
    columns: apiKeyColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    toolbarActions: (
      <button
        type="button"
        className={primaryButtonClassName}
        onClick={onCreate}
        disabled={hasActiveKey || activeCheck.isLoading}
        title={hasActiveKey ? "Revoke the active key before creating a new one" : undefined}
      >
        Create API key
      </button>
    ),
    emptyMessage: "No API keys yet",
    errorMessage: "Could not load API keys",
  });

  const page = useServiceApiKeysQuery(productId, serviceId, listQueryRequest);

  return <DataTable {...bindPage(page)} />;
};
