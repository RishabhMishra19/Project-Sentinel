import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
import { dateTimeRangeFromPreset, type FilterValue } from "../../../shared/ui/filters";
import { useRequestLogQuery } from "../hooks/useRequestLogs";
import { RequestLogDetailPanel } from "../components/RequestLogDetailPanel";
import { RequestLogsTable } from "../components/RequestLogsTable";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery } from "../../services/hooks/useServices";
import { isoToDatetimeLocal } from "../../../shared/utils/dateUtils";
import type { ListQueryRequest } from "../../../shared/dto/request/listQueryRequest";
import { QueryGate } from "../../../shared/ui";

const OPTIONS_LIST_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
};

const ACTIVE_SERVICES_LIST_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

const filtersFromSearchParams = (params: URLSearchParams): Record<string, FilterValue> => {
  const filters: Record<string, FilterValue> = {};

  const productId = params.get("productId");
  if (productId) filters.productId = productId;

  const serviceId = params.get("serviceId");
  if (serviceId) filters.serviceId = serviceId;

  const endpointId = params.get("endpointId");
  if (endpointId) filters.endpointId = endpointId;

  const statusClass = params.get("statusClass");
  if (statusClass) {
    const values = statusClass
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (values.length > 0) filters.statusClass = values;
  }

  const from = isoToDatetimeLocal(params.get("from"));
  const to = isoToDatetimeLocal(params.get("to"));
  if (from || to) {
    filters.occurredAt = { from, to };
  } else {
    filters.occurredAt = dateTimeRangeFromPreset("24h");
  }

  return filters;
};

export const RequestLogsPage = () => {
  const [params] = useSearchParams();
  const selected = useModalState<{ serviceId: string; id: string }>();

  const productsQuery = useProductsQuery(OPTIONS_LIST_QUERY);
  const servicesQuery = useAllServicesQuery(ACTIVE_SERVICES_LIST_QUERY);

  const products = productsQuery.rows;
  const services = servicesQuery.rows;

  const initialFilters = useMemo(
    () => filtersFromSearchParams(params),
    // Seed once from the URL on mount (e.g. Analytics deep-link).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const detailQuery = useRequestLogQuery(
    selected.item?.serviceId ?? null,
    selected.item?.id ?? null,
  );

  return (
    <PageContent>
      <QueryGate
        isLoading={productsQuery.isLoading || servicesQuery.isLoading}
        isError={productsQuery.isError || servicesQuery.isError}
        loadingMessage="Loading products & services..."
        errorMessage="Could not load products & services."
      >
        <RequestLogsTable
          initialFilters={initialFilters}
          onView={(row) => selected.show({ id: row.id, serviceId: row.serviceId })}
          products={products}
          services={services}
        />
      </QueryGate>

      <RequestLogDetailPanel
        open={selected.open}
        log={detailQuery.data}
        loading={detailQuery.isLoading}
        isError={detailQuery.isError}
        onClose={selected.close}
      />
    </PageContent>
  );
};
