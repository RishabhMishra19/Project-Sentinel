import { useMemo, useState } from "react";
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from "../../../shared/ui/data-table";
import type { FilterValue } from "../../../shared/ui/filters";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery, useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { useRequestLogsQuery } from "../hooks/useRequestLogs";
import { mapRequestLogListQuery } from "../utils/mapRequestLogListQuery";
import { createRequestLogColumns, createRequestLogRowActions } from "./requestLogsTableConfig";

type RequestLogsTableProps = {
  onView: (log: RequestLogResponse) => void;
  initialFilters?: Record<string, FilterValue>;
};

export const RequestLogsTable = (=> { onView, initialFilters }: RequestLogsTableProps) {
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null);

  const productId =
    typeof fetchQuery?.filters.productId === "string" ? fetchQuery.filters.productId : undefined;
  const serviceId =
    typeof fetchQuery?.filters.serviceId === "string" ? fetchQuery.filters.serviceId : undefined;

  const productsQuery = useProductsQuery({ page: 0, size: 100 });
  const servicesQuery = useAllServicesQuery({
    page: 0,
    size: 100,
    status: "ACTIVE",
  });
  const endpointsQuery = useServiceEndpointsQuery(serviceId);

  const products = productsQuery.data?.content ?? [];
  const services = servicesQuery.data?.content ?? [];
  const endpoints = endpointsQuery.data ?? [];

  const productOptions = useMemo(
    () => products.map((p) => ({ label: p.name, value: p.id })),
    [products],
  );

  const serviceOptions = useMemo(() => {
    const scoped = productId ? services.filter((s) => s.productId === productId) : services;
    return scoped.map((s) => ({
      label: productId ? s.name : `${s.productName} / ${s.name}`,
      value: s.id,
    }));
  }, [services, productId]);

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
        productOptions,
        serviceOptions,
        endpointOptions,
      }),
    [productOptions, serviceOptions, endpointOptions],
  );

  const listParams = useMemo(
    () => (fetchQuery ? mapRequestLogListQuery(fetchQuery) : null),
    [fetchQuery],
  );

  const { data, isFetching } = useRequestLogsQuery(listParams);

  const rowActions = useMemo(() => createRequestLogRowActions({ onView }), [onView]);

  const { tableProps } = useServerDataTable({
    columns,
    data: data?.content ?? [],
    getRowId: (row) => row.id,
    totalElements: data?.totalElements ?? 0,
    initialState: {
      pageSize: 20,
      sorting: { id: "occurredAt", desc: true },
      filters: initialFilters ?? {},
    },
    rowActions,
    isLoading: isFetching || fetchQuery == null,
    onQueryChange: setFetchQuery,
    emptyMessage: "No events match your filters",
  });

  return <DataTable {...tableProps} />;
}
