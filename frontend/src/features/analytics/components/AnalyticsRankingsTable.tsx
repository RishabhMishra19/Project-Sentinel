import { QueryGate } from "../../../shared/ui";
import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsScope,
} from "../dto/request/analytics.request";
import { useAnalyticsEntityAggregatedQuery } from "../hooks/useAnalytics";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { formatNumber, formatRate } from "../utils/timeRange";

const TAB_LABEL: Record<AnalyticsScope, string> = {
  TENANT: "Products",
  PRODUCT: "Services",
  SERVICE: "Endpoints",
  ENDPOINT: "",
};

export const AnalyticsRankingsTable = () => {
  const { tenantId, productId, serviceId, scope, from, to, mergeParams } =
    useAnalyticsSearchParams();
  let params: AnalyticsEntityAggregatedRequestParams | null = null;
  if (from && to && scope) {
    params = { from, to, scope: scope as any, tenantId, productId, serviceId };
  }
  const entityAggregatedQuery = useAnalyticsEntityAggregatedQuery(params);

  const onRowClick = (scopeId: string) => {
    if (scope === "TENANT") {
      mergeParams({ scope: "PRODUCT", productId: scopeId });
    } else if (scope === "PRODUCT") {
      mergeParams({ scope: "SERVICE", serviceId: scopeId });
    } else if (scope === "SERVICE") {
      mergeParams({ scope: "ENDPOINT", endpoint: scopeId });
    }
  };

  return (
    <div className="flex min-h-48 flex-col gap-3 rounded-xl border border-border bg-background">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">
          Ranked {scope ? TAB_LABEL[scope as AnalyticsScope].toLowerCase() : ""}
        </h3>
      </div>
      <QueryGate
        isLoading={entityAggregatedQuery.isLoading}
        isError={entityAggregatedQuery.isError}
        errorMessage="Could not load rankings."
        className="px-4 py-8"
      >
        {(entityAggregatedQuery.data?.items ?? []).length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">No traffic in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Requests</th>
                  <th className="px-4 py-2 font-medium">Error %</th>
                  <th className="px-4 py-2 font-medium">p95</th>
                </tr>
              </thead>
              <tbody>
                {(entityAggregatedQuery.data?.items ?? []).map((item) => (
                  <tr
                    key={item.id}
                    className={
                      scope !== "PRODUCTS"
                        ? "cursor-pointer border-b border-border/60 hover:bg-muted/40"
                        : "border-b border-border/60"
                    }
                    onClick={() => scope !== "PRODUCTS" && onRowClick(item.id)}
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.id}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatNumber(item.requestCount)}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatRate(item.errorRate)}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {item.latencyP95Ms != null ? `${item.latencyP95Ms} ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </QueryGate>
    </div>
  );
};
