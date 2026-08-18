import { useMemo } from "react";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import type { FilterValue } from "../../../shared/ui/filters";
import { dateTimeRangeFromPreset } from "../../../shared/ui/filters";
import { clampLogsRange } from "../../analytics/utils/timeRange";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery, useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { useRequestLogsQuery } from "../hooks/useRequestLogs";
import { createRequestLogColumns, createRequestLogRowActions } from "./requestLogsTableConfig";

const OPTIONS_LIST_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
};

const ACTIVE_SERVICES_LIST_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

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
};

export const RequestLogsTable = ({ onView, initialFilters }: RequestLogsTableProps) => {
  const productsQuery = useProductsQuery(OPTIONS_LIST_QUERY);
  const servicesQuery = useAllServicesQuery(ACTIVE_SERVICES_LIST_QUERY);

  const products = productsQuery.rows;
  const services = servicesQuery.rows;

  const productOptions = useMemo(
    () => products.map((p) => ({ label: p.name, value: p.id })),
    [products],
  );

  const initialColumns = useMemo(
    () =>
      createRequestLogColumns({
        productOptions,
        serviceOptions: [],
        endpointOptions: [],
      }),
    [productOptions],
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
    emptyMessage: "No events match your filters",
    errorMessage: "Could not load events",
  });

  const productId =
    typeof query.filters.productId === "string" ? query.filters.productId : undefined;
  const serviceId =
    typeof query.filters.serviceId === "string" ? query.filters.serviceId : undefined;

  const endpointsQuery = useServiceEndpointsQuery(serviceId);
  const endpoints = endpointsQuery.rows;

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

  const listQueryRequest = useMemo(() => {
    const fallback = defaultLogsRange();
    const clamped = clampLogsRange(
      tableListQueryRequest.from ?? fallback.from,
      tableListQueryRequest.to ?? fallback.to,
    );
    return {
      ...tableListQueryRequest,
      from: clamped.from,
      to: clamped.to,
    };
  }, [tableListQueryRequest]);

  const page = useRequestLogsQuery(listQueryRequest);

  return <DataTable {...bindPage(page)} columns={columns} />;
};
