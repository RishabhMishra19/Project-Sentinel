import type {
  AnalyticsQueryParams,
  AnalyticsRankingsParams,
  AnalyticsScope,
} from "../dto/request/analytics.request";
import type { AnalyticsRankingItem } from "../dto/response/analytics.response";
import type { AnalyticsFilterPatch } from "./analyticsFilters";
import { clampLogsRange, parseBucket, suggestedBucket } from "./timeRange";

export type AnalyticsUrlPatch = Record<string, string | null | undefined>;

export type AnalyticsSelectionIds = {
  productId?: string;
  serviceId?: string;
  endpointId?: string;
};

type ServiceRef = { id: string; productId: string };

export const parseScope = (raw: string | null): AnalyticsScope => {
  if (raw === "PRODUCT" || raw === "SERVICE" || raw === "ENDPOINT") {
    return raw;
  }
  return "TENANT";
};

export const isScopeReady = (
  scope: AnalyticsScope,
  { productId, serviceId, endpointId }: AnalyticsSelectionIds,
): boolean =>
  scope === "TENANT" ||
  (scope === "PRODUCT" && !!productId) ||
  (scope === "SERVICE" && !!serviceId) ||
  (scope === "ENDPOINT" && !!endpointId);

export const buildAnalyticsQueryParams = (
  scope: AnalyticsScope,
  ids: AnalyticsSelectionIds,
  range: { from: string; to: string; bucket: AnalyticsQueryParams["bucket"] },
): AnalyticsQueryParams | null => {
  if (!isScopeReady(scope, ids)) return null;
  return {
    scope,
    productId: ids.productId,
    serviceId: ids.serviceId,
    endpointId: ids.endpointId,
    from: range.from,
    to: range.to,
    bucket: range.bucket,
  };
};

export const buildAnalyticsRankingsParams = (
  queryParams: AnalyticsQueryParams | null,
): AnalyticsRankingsParams | null =>
  queryParams && queryParams.scope !== "ENDPOINT"
    ? { ...queryParams, sortBy: "TRAFFIC", page: 0, size: 20 }
    : null;

/** Apply a partial patch onto search params, keeping from/to/bucket populated. */
export const applyAnalyticsUrlPatch = (
  prev: URLSearchParams,
  patch: AnalyticsUrlPatch,
  defaults: { from: string; to: string },
): URLSearchParams => {
  const next = new URLSearchParams(prev);
  for (const [key, value] of Object.entries(patch)) {
    if (value == null || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  if (!next.get("from")) next.set("from", defaults.from);
  if (!next.get("to")) next.set("to", defaults.to);
  const from = next.get("from")!;
  const to = next.get("to")!;
  if (parseBucket(next.get("bucket")) == null) {
    next.set("bucket", suggestedBucket(from, to));
  }
  return next;
};

export const tabChangePatch = (
  nextScope: AnalyticsScope,
  range: { from: string; to: string; bucket: string },
): AnalyticsUrlPatch => {
  const patch: AnalyticsUrlPatch = {
    tab: nextScope.toLowerCase(),
    from: range.from,
    to: range.to,
    bucket: range.bucket,
  };
  if (nextScope === "TENANT") {
    patch.productId = null;
    patch.serviceId = null;
    patch.endpointId = null;
  } else if (nextScope === "PRODUCT") {
    patch.serviceId = null;
    patch.endpointId = null;
  } else if (nextScope === "SERVICE") {
    patch.endpointId = null;
  }
  return patch;
};

export const rankingClickPatch = (
  scope: AnalyticsScope,
  item: AnalyticsRankingItem,
  ids: AnalyticsSelectionIds,
): AnalyticsUrlPatch | null => {
  if (scope === "TENANT") {
    return {
      tab: "product",
      productId: item.id,
      serviceId: null,
      endpointId: null,
    };
  }
  if (scope === "PRODUCT") {
    return {
      tab: "service",
      productId: ids.productId ?? null,
      serviceId: item.id,
      endpointId: null,
    };
  }
  if (scope === "SERVICE") {
    return {
      tab: "endpoint",
      productId: ids.productId ?? null,
      serviceId: ids.serviceId ?? null,
      endpointId: item.id,
    };
  }
  return null;
};

/** Resolve productId from the selected service after a filter change. */
export const withServiceProductCascade = (
  patch: AnalyticsFilterPatch,
  scope: AnalyticsScope,
  services: ServiceRef[],
): AnalyticsFilterPatch => {
  if (scope !== "SERVICE" && scope !== "ENDPOINT") return patch;
  const selected = services.find((s) => s.id === patch.serviceId);
  return {
    ...patch,
    productId: selected?.productId ?? null,
    endpointId: scope === "SERVICE" ? null : patch.endpointId,
  };
};

export const resolveDefaultSelectionPatch = (
  scope: AnalyticsScope,
  ids: AnalyticsSelectionIds,
  catalog: {
    products: { id: string }[];
    services: ServiceRef[];
    endpoints: { id: string }[];
    endpointsReady: boolean;
  },
): AnalyticsUrlPatch | null => {
  if (scope === "PRODUCT") {
    if (catalog.products.length === 0) return null;
    if (ids.productId && catalog.products.some((p) => p.id === ids.productId)) return null;
    return {
      productId: catalog.products[0].id,
      serviceId: null,
      endpointId: null,
    };
  }

  if (scope === "SERVICE") {
    if (catalog.services.length === 0) return null;
    if (ids.serviceId && catalog.services.some((s) => s.id === ids.serviceId)) return null;
    const first = catalog.services[0];
    return {
      productId: first.productId,
      serviceId: first.id,
      endpointId: null,
    };
  }

  if (scope === "ENDPOINT") {
    if (catalog.services.length === 0) return null;
    const serviceOk = !!ids.serviceId && catalog.services.some((s) => s.id === ids.serviceId);
    if (!serviceOk) {
      const first = catalog.services[0];
      return {
        productId: first.productId,
        serviceId: first.id,
        endpointId: null,
      };
    }
    if (!catalog.endpointsReady || catalog.endpoints.length === 0) return null;
    if (ids.endpointId && catalog.endpoints.some((e) => e.id === ids.endpointId)) return null;
    return { endpointId: catalog.endpoints[0].id };
  }

  return null;
};

export const buildLogsSearchParams = (
  scope: AnalyticsScope,
  range: { from: string; to: string },
  ids: AnalyticsSelectionIds,
): URLSearchParams => {
  const clamped = clampLogsRange(range.from, range.to);
  const q = new URLSearchParams({
    from: clamped.from,
    to: clamped.to,
  });
  if (scope === "PRODUCT" || scope === "SERVICE" || scope === "ENDPOINT") {
    if (ids.productId) q.set("productId", ids.productId);
  }
  if (scope === "SERVICE" || scope === "ENDPOINT") {
    if (ids.serviceId) q.set("serviceId", ids.serviceId);
  }
  if (scope === "ENDPOINT" && ids.endpointId) {
    q.set("endpointId", ids.endpointId);
  }
  return q;
};
