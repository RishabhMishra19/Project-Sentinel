import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery, useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { AnalyticsBucket, AnalyticsScope } from "../dto/request/analytics.request";
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
  clampLogsRange,
  fromDatetimeLocalValue,
  parseBucket,
  rangeFromPreset,
  suggestedBucket,
  toDatetimeLocalValue,
  type TimePreset,
} from "../utils/timeRange";

const TABS: { id: AnalyticsScope; label: string }[] = [
  { id: "TENANT", label: "Tenant" },
  { id: "PRODUCT", label: "Product" },
  { id: "SERVICE", label: "Service" },
  { id: "ENDPOINT", label: "Endpoint" },
];

const PRESETS: TimePreset[] = ["1h", "6h", "24h", "7d", "30d", "90d"];

const BUCKETS: { id: AnalyticsBucket; label: string }[] = [
  { id: "MINUTE", label: "Minute" },
  { id: "HOUR", label: "Hour" },
  { id: "DAY", label: "Day" },
];

const selectClassName =
  "min-w-[12rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground";

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

  const defaultRange = useMemo(() => rangeFromPreset("24h"), []);
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

  const setPreset = (preset: TimePreset) => {
    const range = rangeFromPreset(preset);
    patchParams({
      from: range.from,
      to: range.to,
      bucket: suggestedBucket(range.from, range.to),
    });
  };

  const setCustomBound = (bound: "from" | "to", localValue: string) => {
    const iso = fromDatetimeLocalValue(localValue);
    if (!iso) return;
    const nextFrom = bound === "from" ? iso : from;
    const nextTo = bound === "to" ? iso : to;
    if (new Date(nextFrom).getTime() >= new Date(nextTo).getTime()) return;
    patchParams({
      from: nextFrom,
      to: nextTo,
      bucket: suggestedBucket(nextFrom, nextTo),
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

  const productsQuery = useProductsQuery(scope === "PRODUCT" ? { page: 0, size: 100 } : null);
  const servicesQuery = useAllServicesQuery(
    scope === "SERVICE" || scope === "ENDPOINT" ? { page: 0, size: 100, status: "ACTIVE" } : null,
  );
  const services = servicesQuery.data?.content ?? [];
  const products = productsQuery.data?.content ?? [];
  const endpointsQuery = useServiceEndpointsQuery(scope === "ENDPOINT" ? serviceId : undefined);
  const endpoints = endpointsQuery.data ?? [];

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
    if (productId) q.set("productId", productId);
    if (serviceId) q.set("serviceId", serviceId);
    if (endpointId) q.set("endpointId", endpointId);
    navigate(`/${ROUTE_PATHS.logs}?${q.toString()}`);
  };

  const points = timeseriesQuery.data?.points ?? [];

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

      <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/50"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            From
            <input
              type="datetime-local"
              className={selectClassName}
              value={toDatetimeLocalValue(from)}
              onChange={(e) => setCustomBound("from", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            To
            <input
              type="datetime-local"
              className={selectClassName}
              value={toDatetimeLocalValue(to)}
              onChange={(e) => setCustomBound("to", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Granularity
            <select
              className={selectClassName}
              value={bucket}
              onChange={(e) => patchParams({ bucket: e.target.value as AnalyticsBucket })}
            >
              {BUCKETS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {scope === "PRODUCT" && (
        <label className="flex w-fit flex-col gap-1 text-xs text-muted-foreground">
          Product
          <select
            className="min-w-[16rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={productId ?? ""}
            onChange={(e) =>
              patchParams({
                productId: e.target.value || null,
                serviceId: null,
                endpointId: null,
              })
            }
          >
            <option value="">Select product</option>
            {(productsQuery.data?.content ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {scope === "SERVICE" && (
        <label className="flex w-fit flex-col gap-1 text-xs text-muted-foreground">
          Service
          <select
            className="min-w-[16rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={serviceId ?? ""}
            onChange={(e) => {
              const id = e.target.value || null;
              const selected = services.find((s) => s.id === id);
              patchParams({
                productId: selected?.productId ?? null,
                serviceId: id,
                endpointId: null,
              });
            }}
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.productName} / {s.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {scope === "ENDPOINT" && (
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Service
            <select
              className="min-w-[16rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={serviceId ?? ""}
              onChange={(e) => {
                const id = e.target.value || null;
                const selected = services.find((s) => s.id === id);
                patchParams({
                  productId: selected?.productId ?? null,
                  serviceId: id,
                  endpointId: null,
                });
              }}
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.productName} / {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Endpoint
            <select
              className="min-w-[18rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={endpointId ?? ""}
              disabled={!serviceId || endpointsQuery.isLoading}
              onChange={(e) =>
                patchParams({
                  endpointId: e.target.value || null,
                })
              }
            >
              <option value="">
                {!serviceId
                  ? "Select a service first"
                  : endpointsQuery.isLoading
                    ? "Loading endpoints…"
                    : "Select endpoint"}
              </option>
              {endpoints.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.method} {ep.pathTemplate}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {!scopeReady ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          {scope === "PRODUCT" && "Select a product to view analytics."}
          {scope === "SERVICE" && "Select a service to view analytics."}
          {scope === "ENDPOINT" && "Select a service and endpoint to view analytics."}
        </div>
      ) : (
        <>
          {summaryQuery.isError || timeseriesQuery.isError ? (
            <p className="text-sm text-destructive">Could not load analytics for this scope.</p>
          ) : null}

          <AnalyticsKpiStrip summary={summaryQuery.data} />

          <div className="grid gap-4 lg:grid-cols-1">
            <AnalyticsVolumeChart points={points} />
            <AnalyticsErrorRateChart points={points} />
            <AnalyticsLatencyChart points={points} />
          </div>

          {scope === "ENDPOINT" ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={openInLogs}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/50"
                >
                  Open in Logs
                </button>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <EndpointStatusChart items={statusQuery.data ?? []} />
                <EndpointExceptionsChart items={exceptionsQuery.data ?? []} />
              </div>
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
