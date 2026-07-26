import {
  dateRangeFromPreset,
  type FilterField,
  type FilterOption,
  type FiltersChange,
  type FilterValue,
} from "../../../shared/ui/filters";
import type { AnalyticsBucket, AnalyticsScope } from "../dto/request/analytics.request";
import { parseBucket, suggestedBucket } from "./timeRange";

const BUCKET_OPTIONS: FilterOption[] = [
  { label: "Minute", value: "MINUTE" },
  { label: "Hour", value: "HOUR" },
  { label: "Day", value: "DAY" },
];

export const isoToDateInput = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * Analytics stores `to` as an exclusive end (start of the next day).
 * Convert that ISO back to the inclusive YYYY-MM-DD the dateRange UI expects,
 * so presets still match in chips / the editor.
 */
export const isoExclusiveToToDateInput = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const inclusive = new Date(d.getTime() - 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${inclusive.getFullYear()}-${pad(inclusive.getMonth() + 1)}-${pad(inclusive.getDate())}`;
};

export const dateToFromIso = (date: string): string => new Date(`${date}T00:00:00`).toISOString();

export const dateToToIso = (date: string): string => {
  const start = new Date(`${date}T00:00:00`);
  start.setDate(start.getDate() + 1);
  return start.toISOString();
};

export const buildAnalyticsFilterFields = ({
  scope,
  productOptions,
  serviceOptions,
  endpointOptions,
}: {
  scope: AnalyticsScope;
  productOptions: FilterOption[];
  serviceOptions: FilterOption[];
  endpointOptions: FilterOption[];
}): FilterField[] => {
  const fields: FilterField[] = [];

  if (scope === "PRODUCT") {
    fields.push({
      id: "productId",
      header: "Product",
      filter: { type: "select", options: productOptions },
    });
  }

  if (scope === "SERVICE" || scope === "ENDPOINT") {
    fields.push({
      id: "serviceId",
      header: "Service",
      filter: { type: "select", options: serviceOptions },
    });
  }

  if (scope === "ENDPOINT") {
    fields.push({
      id: "endpointId",
      header: "Endpoint",
      filter: { type: "select", options: endpointOptions },
    });
  }

  fields.push({
    id: "time",
    header: "Time",
    filter: { type: "dateRange" },
  });

  fields.push({
    id: "bucket",
    header: "Granularity",
    filter: { type: "select", options: BUCKET_OPTIONS },
  });

  return fields;
};

export const filtersFromSearchParams = (
  params: URLSearchParams,
  scope: AnalyticsScope,
): Record<string, FilterValue> => {
  const filters: Record<string, FilterValue> = {};

  if (scope === "PRODUCT") {
    const productId = params.get("productId");
    if (productId) filters.productId = productId;
  }

  if (scope === "SERVICE" || scope === "ENDPOINT") {
    const serviceId = params.get("serviceId");
    if (serviceId) filters.serviceId = serviceId;
  }

  if (scope === "ENDPOINT") {
    const endpointId = params.get("endpointId");
    if (endpointId) filters.endpointId = endpointId;
  }

  const from = isoToDateInput(params.get("from"));
  const to = isoExclusiveToToDateInput(params.get("to"));
  if (from || to) {
    filters.time = { from, to };
  } else {
    filters.time = dateRangeFromPreset("1d");
  }

  const fallback = dateRangeFromPreset("1d");
  const fromIso = from ? dateToFromIso(from) : dateToFromIso(fallback.from);
  const toIso = to ? dateToToIso(to) : dateToToIso(fallback.to);
  filters.bucket = parseBucket(params.get("bucket")) ?? suggestedBucket(fromIso, toIso);

  return filters;
};

export type AnalyticsFilterPatch = {
  productId?: string | null;
  serviceId?: string | null;
  endpointId?: string | null;
  from: string;
  to: string;
  bucket: AnalyticsBucket;
};

/** Domain wrap over encodeFilters output (exclusive day end, scope cascading). */
export const mapAnalyticsFiltersToPatch = (
  { apiFilters }: FiltersChange,
  scope: AnalyticsScope,
  previous: {
    productId?: string;
    serviceId?: string;
    endpointId?: string;
  },
): AnalyticsFilterPatch => {
  let productId = scope === "PRODUCT" ? (apiFilters.productId ?? null) : null;
  let serviceId =
    scope === "SERVICE" || scope === "ENDPOINT" ? (apiFilters.serviceId ?? null) : null;
  let endpointId = scope === "ENDPOINT" ? (apiFilters.endpointId ?? null) : null;

  if (scope === "PRODUCT") {
    serviceId = null;
    endpointId = null;
  } else if (scope === "SERVICE") {
    endpointId = null;
    productId = previous.productId ?? null;
  } else if (scope === "ENDPOINT") {
    if (serviceId !== (previous.serviceId ?? null)) {
      endpointId = null;
    }
    productId = previous.productId ?? null;
  } else {
    productId = null;
    serviceId = null;
    endpointId = null;
  }

  const fallback = dateRangeFromPreset("1d");
  // encodeFilters emits YYYY-MM-DD for dateRange under from/to (field id "time").
  const fromDate = apiFilters.from ?? fallback.from;
  const toDate = apiFilters.to ?? fallback.to;
  const fromIso = dateToFromIso(fromDate);
  const toIso = dateToToIso(toDate);

  const bucket = parseBucket(apiFilters.bucket ?? null) ?? suggestedBucket(fromIso, toIso);

  return { productId, serviceId, endpointId, from: fromIso, to: toIso, bucket };
};
