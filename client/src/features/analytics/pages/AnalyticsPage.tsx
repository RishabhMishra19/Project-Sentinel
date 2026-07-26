import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
import {
  AppliedFilterChips,
  dateRangeFromPreset,
  Filters,
  type FiltersChange,
} from "../../../shared/ui/filters";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery, useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { AnalyticsScope } from "../dto/request/analytics.request";
import type { AnalyticsRankingItem } from "../dto/response/analytics.response";
import {
  AnalyticsErrorRateChart,
  AnalyticsLatencyChart,
  AnalyticsVolumeChart,
} from "../components/AnalyticsCharts";
import { AnalyticsKpiStrip } from "../components/AnalyticsKpiStrip";
import { AnalyticsRankingsTable } from "../components/AnalyticsRankingsTable";
import { EndpointExceptionsChart, EndpointStatusChart } from "../components/EndpointDetailCharts";
import {
  useAnalyticsRankingsQuery,
  useAnalyticsSummaryQuery,
  useAnalyticsTimeseriesQuery,
  useEndpointExceptionsQuery,
  useEndpointStatusBreakdownQuery,
} from "../hooks/useAnalytics";
import {
  buildAnalyticsFilterFields,
  dateToFromIso,
  dateToToIso,
  filtersFromSearchParams,
  mapAnalyticsFiltersToPatch,
} from "../utils/analyticsFilters";
import { clampLogsRange, parseBucket, suggestedBucket } from "../utils/timeRange";

const TABS: { id: AnalyticsScope; label: string }[] = [
  { id: "TENANT", label: "Tenant" },
  { id: "PRODUCT", label: "Product" },
  { id: "SERVICE", label: "Service" },
  { id: "ENDPOINT", label: "Endpoint" },
];

function parseScope(raw: string | null): AnalyticsScope {
  if (raw === "PRODUCT" || raw === "SERVICE" || raw === "ENDPOINT") {
    return raw;
  }
  return "TENANT";
}

export function AnalyticsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const scope = parseScope(params.get("tab")?.toUpperCase() ?? params.get("scope"));
  const productId = params.get("productId") ?? undefined;
  const serviceId = params.get("serviceId") ?? undefined;
  const endpointId = params.get("endpointId") ?? undefined;

  const defaultRange = useMemo(() => {
    const dates = dateRangeFromPreset("1d");
    return {
      from: dateToFromIso(dates.from),
      to: dateToToIso(dates.to),
    };
  }, []);
  const from = params.get("from") ?? defaultRange.from;
  const to = params.get("to") ?? defaultRange.to;
  const bucket = parseBucket(params.get("bucket")) ?? suggestedBucket(from, to);

  // Persist required bucket in the URL when missing / invalid.
  useEffect(() => {
    if (parseBucket(params.get("bucket")) != null) return;
    const next = new URLSearchParams(params);
    next.set("from", from);
    next.set("to", to);
    next.set("bucket", bucket);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when URL lacks bucket
  }, [params, from, to, bucket, setParams]);

  const patchParams = (patch: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value == null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    if (!next.get("from")) next.set("from", from);
    if (!next.get("to")) next.set("to", to);
    if (!next.get("bucket")) next.set("bucket", bucket);
    setParams(next, { replace: true });
  };

  const setTab = (nextScope: AnalyticsScope) => {
    const patch: Record<string, string | null | undefined> = {
      tab: nextScope.toLowerCase(),
      from,
      to,
      bucket,
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
    patchParams(patch);
  };

  const productsQuery = useProductsQuery(
    scope === "PRODUCT" ? { page: 0, size: 100 } : null,
  );
  const servicesQuery = useAllServicesQuery(
    scope === "SERVICE" || scope === "ENDPOINT"
      ? { page: 0, size: 100, status: "ACTIVE" }
      : null,
  );
  const services = servicesQuery.data?.content ?? [];
  const products = productsQuery.data?.content ?? [];
  const endpointsQuery = useServiceEndpointsQuery(
    scope === "ENDPOINT" ? serviceId : undefined,
  );
  const endpoints = endpointsQuery.data ?? [];

  const filters = useMemo(
    () => filtersFromSearchParams(params, scope),
    [params, scope],
  );

  const filterFields = useMemo(
    () =>
      buildAnalyticsFilterFields({
        scope,
        productOptions: products.map((p) => ({ label: p.name, value: p.id })),
        serviceOptions: services.map((s) => ({
          label: `${s.productName} / ${s.name}`,
          value: s.id,
        })),
        endpointOptions: endpoints.map((ep) => ({
          label: `${ep.method} ${ep.pathTemplate}`,
          value: ep.id,
        })),
      }),
    [scope, products, services, endpoints],
  );

  const onFiltersChange = (next: FiltersChange) => {
    const mapped = mapAnalyticsFiltersToPatch(next, scope, {
      productId,
      serviceId,
      endpointId,
    });

    let nextProductId = mapped.productId;
    let nextServiceId = mapped.serviceId;
    let nextEndpointId = mapped.endpointId;

    if (scope === "SERVICE" || scope === "ENDPOINT") {
      const selected = services.find((s) => s.id === nextServiceId);
      nextProductId = selected?.productId ?? null;
      if (nextServiceId !== (serviceId ?? null)) {
        nextEndpointId = null;
      }
    }

    if (scope === "PRODUCT") {
      nextServiceId = null;
      nextEndpointId = null;
    } else if (scope === "SERVICE") {
      nextEndpointId = null;
    } else if (scope === "TENANT") {
      nextProductId = null;
      nextServiceId = null;
      nextEndpointId = null;
    }

    patchParams({
      productId: nextProductId,
      serviceId: nextServiceId,
      endpointId: nextEndpointId,
      from: mapped.from,
      to: mapped.to,
      bucket: mapped.bucket,
    });
  };

  const scopeReady =
    scope === "TENANT" ||
    (scope === "PRODUCT" && !!productId) ||
    (scope === "SERVICE" && !!serviceId) ||
    (scope === "ENDPOINT" && !!endpointId);

  const queryParams = scopeReady
    ? {
        scope,
        productId,
        serviceId,
        endpointId,
        from,
        to,
        bucket,
      }
    : null;

  const rankingsParams =
    queryParams && scope !== "ENDPOINT"
      ? { ...queryParams, sortBy: "TRAFFIC" as const, page: 0, size: 20 }
      : null;

  const summaryQuery = useAnalyticsSummaryQuery(queryParams);
  const timeseriesQuery = useAnalyticsTimeseriesQuery(queryParams);
  const rankingsQuery = useAnalyticsRankingsQuery(rankingsParams);
  const statusQuery = useEndpointStatusBreakdownQuery(
    scope === "ENDPOINT" ? (endpointId ?? null) : null,
    from,
    to,
  );
  const exceptionsQuery = useEndpointExceptionsQuery(
    scope === "ENDPOINT" ? (endpointId ?? null) : null,
    from,
    to,
  );

  // Default each scoped tab to the first available value.
  useEffect(() => {
    if (scope === "PRODUCT") {
      if (products.length === 0) return;
      if (productId && products.some((p) => p.id === productId)) return;
      patchParams({
        productId: products[0].id,
        serviceId: null,
        endpointId: null,
      });
      return;
    }

    if (scope === "SERVICE") {
      if (services.length === 0) return;
      if (serviceId && services.some((s) => s.id === serviceId)) return;
      const first = services[0];
      patchParams({
        productId: first.productId,
        serviceId: first.id,
        endpointId: null,
      });
      return;
    }

    if (scope === "ENDPOINT") {
      if (services.length === 0) return;
      const serviceOk = !!serviceId && services.some((s) => s.id === serviceId);
      if (!serviceOk) {
        const first = services[0];
        patchParams({
          productId: first.productId,
          serviceId: first.id,
          endpointId: null,
        });
        return;
      }
      if (!endpointsQuery.isSuccess || endpoints.length === 0) return;
      if (endpointId && endpoints.some((e) => e.id === endpointId)) return;
      patchParams({ endpointId: endpoints[0].id });
    }
    // patchParams reads latest search params; intentionally omit it from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-select when list/selection changes
  }, [
    scope,
    products,
    services,
    endpoints,
    endpointsQuery.isSuccess,
    productId,
    serviceId,
    endpointId,
  ]);

  const onRankingClick = (item: AnalyticsRankingItem) => {
    if (scope === "TENANT") {
      patchParams({
        tab: "product",
        productId: item.id,
        serviceId: null,
        endpointId: null,
      });
      return;
    }
    if (scope === "PRODUCT") {
      patchParams({
        tab: "service",
        productId: productId ?? null,
        serviceId: item.id,
        endpointId: null,
      });
      return;
    }
    if (scope === "SERVICE") {
      patchParams({
        tab: "endpoint",
        productId: productId ?? null,
        serviceId: serviceId ?? null,
        endpointId: item.id,
      });
    }
  };

  const openInLogs = () => {
    const clamped = clampLogsRange(from, to);
    const q = new URLSearchParams({
      from: clamped.from,
      to: clamped.to,
    });
    // Carry over whatever scope filters Logs supports.
    if (scope === "PRODUCT" || scope === "SERVICE" || scope === "ENDPOINT") {
      if (productId) q.set("productId", productId);
    }
    if (scope === "SERVICE" || scope === "ENDPOINT") {
      if (serviceId) q.set("serviceId", serviceId);
    }
    if (scope === "ENDPOINT" && endpointId) {
      q.set("endpointId", endpointId);
    }
    navigate(`/${ROUTE_PATHS.logs}?${q.toString()}`);
  };

  const points = timeseriesQuery.data?.points ?? [];

  const filtersConfig = useMemo(
    () => ({
      filters,
      onFiltersChange,
    }),
    // onFiltersChange closes over latest URL/list state each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, scope, productId, serviceId, endpointId, services],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-px">
        {TABS.map((tab) => {
          const active = scope === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openInLogs}
            disabled={!scopeReady}
            className="inline-flex h-7 items-center gap-1.5 rounded border border-accent bg-accent px-2 text-xs text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            Open in Logs
          </button>
          <div className="ml-auto">
            <Filters fields={filterFields} filtersConfig={filtersConfig} />
          </div>
        </div>
        <AppliedFilterChips
          fields={filterFields}
          filtersConfig={filtersConfig}
        />
      </div>

      {!scopeReady ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          {scope === "PRODUCT" && "Select a product to view analytics."}
          {scope === "SERVICE" && "Select a service to view analytics."}
          {scope === "ENDPOINT" &&
            "Select a service and endpoint to view analytics."}
        </div>
      ) : (
        <>
          {summaryQuery.isError || timeseriesQuery.isError ? (
            <p className="text-sm text-destructive">
              Could not load analytics for this scope.
            </p>
          ) : null}

          <AnalyticsKpiStrip summary={summaryQuery.data} />

          <div className="grid gap-4 lg:grid-cols-1">
            <AnalyticsVolumeChart points={points} />
            <AnalyticsErrorRateChart points={points} />
            <AnalyticsLatencyChart points={points} />
          </div>

          {scope === "ENDPOINT" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <EndpointStatusChart items={statusQuery.data ?? []} />
              <EndpointExceptionsChart items={exceptionsQuery.data ?? []} />
            </div>
          ) : (
            <AnalyticsRankingsTable
              scope={scope}
              items={rankingsQuery.data?.content ?? []}
              isLoading={rankingsQuery.isLoading}
              isError={rankingsQuery.isError}
              onRowClick={onRankingClick}
            />
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        Need raw events?{" "}
        <Link className="underline" to={`/${ROUTE_PATHS.logs}`}>
          Open Logs
        </Link>
      </p>
    </div>
  );
}
