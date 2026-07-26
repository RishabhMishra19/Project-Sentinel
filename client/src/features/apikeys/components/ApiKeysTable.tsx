import { useMemo, useState } from "react";
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { ServiceApiKeyResponse } from "../dto/response/apikey.response";
import { useServiceApiKeysQuery } from "../hooks/useApiKeys";
import { mapApiKeyListQuery } from "../utils/mapApiKeyListQuery";
import { apiKeyColumns, createApiKeyRowActions } from "./apiKeysTableConfig";

const ACTIVE_KEY_CHECK_PARAMS = {
  page: 0,
  size: 1,
  status: "ACTIVE" as const,
};

type ApiKeysTableProps = {
  productId: string;
  serviceId: string;
  onCreate: () => void;
  onRevoke: (key: ServiceApiKeyResponse) => void;
};

export const ApiKeysTable = ({ productId, serviceId, onCreate, onRevoke }: ApiKeysTableProps) => {
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null);

  const listParams = useMemo(
    () => (fetchQuery ? mapApiKeyListQuery(fetchQuery) : null),
    [fetchQuery],
  );

  const { data, isFetching } = useServiceApiKeysQuery(productId, serviceId, listParams);

  const activeCheck = useServiceApiKeysQuery(productId, serviceId, ACTIVE_KEY_CHECK_PARAMS);
  const hasActiveKey = (activeCheck.data?.totalElements ?? 0) > 0;

  const rowActions = useMemo(() => createApiKeyRowActions({ onRevoke }), [onRevoke]);

  const { tableProps } = useServerDataTable({
    columns: apiKeyColumns,
    data: data?.content ?? [],
    getRowId: (row) => row.id,
    totalElements: data?.totalElements ?? 0,
    initialState: { pageSize: 10 },
    rowActions,
    isLoading: isFetching || fetchQuery == null,
    onQueryChange: setFetchQuery,
    toolbarActions: (
      <button
        type="button"
        className={primaryButtonClassName}
        onClick={onCreate}
        disabled={hasActiveKey || activeCheck.isFetching}
        title={hasActiveKey ? "Revoke the active key before creating a new one" : undefined}
      >
        Create API key
      </button>
    ),
    emptyMessage: "No API keys yet",
  });

  return <DataTable {...tableProps} />;
};
