import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import type { FilterValue } from "../../../shared/ui/filters";
import { dateTimeRangeFromPreset } from "../../../shared/ui/filters";
import { clampLogsRange } from "../../analytics/utils/timeRange";
import { useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { useRequestLogsQuery } from "../hooks/useRequestLogs";
import { createRequestLogColumns, createRequestLogRowActions } from "./requestLogsTableConfig";
import { SelectField } from "../../../shared/forms/SelectField";
import { useUrlSyncedSelection } from "../../../shared/hooks/useUrlSyncedSelection";
import type { ProductResponse } from "../../products/dto/response/product.response";
import type { ServiceResponse } from "../../services/dto/response/service.response";
import type { ListRequestLogRequest } from "../dto/request/ListRequestLog.request";

const datetimeLocalToIso = (local: string): string | null => {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const defaultLogsRange = (): { from: string; to: string } => {
  const range = dateTimeRangeFromPreset("24h");
  return {
    from: datetimeLocalToIso(range.from)!,
    to: datetimeLocalToIso(range.to)!,
  };
};

type RequestLogsTableProps = {
  onView: (log: RequestLogResponse) => void;
  initialFilters?: Record<string, FilterValue>;
  products: ProductResponse[];
  services: ServiceResponse[];
};

export const RequestLogsTable = ({
  onView,
  initialFilters,
  products,
  services,
}: RequestLogsTableProps) => {
  const { selectedId: selectedProductId, onChange: onProductChange } = useUrlSyncedSelection({
    paramKey: "productId",
    items: products,
  });

  const relevantServices = useMemo(
    () => services.filter((v) => v.productId === selectedProductId),
    [services, selectedProductId],
  );

  const { selectedId: selectedServiceId, onChange: onServiceChange } = useUrlSyncedSelection({
    paramKey: "serviceId",
    items: relevantServices,
  });

  console.log({ selectedProductId, selectedServiceId });

  const initialColumns = useMemo(
    () =>
      createRequestLogColumns({
        endpointOptions: [],
      }),
    [],
  );

  const rowActions = useMemo(() => createRequestLogRowActions({ onView }), [onView]);

  const {
    query,
    listQueryRequest: tableListQueryRequest,
    bindPage,
  } = useDataTable({
    columns: initialColumns,
    getRowId: (row) => row.id,
    initialState: {
      pageSize: 20,
      sorting: { id: "occurredAt", desc: true },
      filters: initialFilters ?? {},
    },
    rowActions,
    toolbarActions: (
      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          className="min-w-[12rem]"
          value={selectedProductId ?? ""}
          onChange={(event) => {
            onProductChange(event.target.value);
            onServiceChange(null);
          }}
          aria-label="Filter Request Logs by product"
          emptyPlaceholder="No products"
          options={products.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
        />

        <SelectField
          className="min-w-[12rem]"
          value={selectedServiceId ?? ""}
          onChange={(event) => onServiceChange(event.target.value)}
          aria-label="Filter Request Logs by service"
          emptyPlaceholder="No services"
          options={relevantServices.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
        />
      </div>
    ),
    emptyMessage: "No events match your filters",
    errorMessage: "Could not load events",
    enablePagination: false,
  });

  const endpointsQuery = useServiceEndpointsQuery(selectedServiceId ?? undefined);
  const endpoints = endpointsQuery.rows;

  const endpointOptions = useMemo(
    () =>
      endpoints.map((ep) => ({
        label: `${ep.method} ${ep.pathTemplate}`,
        value: ep.id,
      })),
    [endpoints],
  );

  const columns = useMemo(
    () =>
      createRequestLogColumns({
        endpointOptions,
      }),
    [endpointOptions],
  );

  const listQueryRequest: ListRequestLogRequest | undefined = useMemo(() => {
    if (selectedServiceId == null) return undefined;
    const fallback = defaultLogsRange();
    const clamped = clampLogsRange(
      tableListQueryRequest.from ?? fallback.from,
      tableListQueryRequest.to ?? fallback.to,
    );
    return {
      // ...tableListQueryRequest,
      from: clamped.from,
      to: clamped.to,
      limit: 10,
    };
  }, [tableListQueryRequest]);

  const page = useRequestLogsQuery(selectedServiceId, listQueryRequest);

  return <DataTable {...bindPage(page)} columns={columns} />;
};
