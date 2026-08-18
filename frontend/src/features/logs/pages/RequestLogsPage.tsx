import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
import { dateTimeRangeFromPreset, type FilterValue } from "../../../shared/ui/filters";
import { useRequestLogQuery } from "../hooks/useRequestLogs";
import { RequestLogDetailPanel } from "../components/RequestLogDetailPanel";
import { RequestLogsTable } from "../components/RequestLogsTable";

const isoToDatetimeLocal = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const selected = useModalState<string>();

  const initialFilters = useMemo(
    () => filtersFromSearchParams(params),
    // Seed once from the URL on mount (e.g. Analytics deep-link).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const detailQuery = useRequestLogQuery(selected.item);

  return (
    <PageContent>
      <RequestLogsTable initialFilters={initialFilters} onView={(row) => selected.show(row.id)} />

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
