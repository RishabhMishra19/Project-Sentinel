import { QueryGate } from "../../../shared/ui";
import type { AnalyticsRankingsParams, AnalyticsScope } from "../dto/request/analytics.request";
import type { AnalyticsRankingItem } from "../dto/response/analytics.response";
import { useAnalyticsRankingsQuery } from "../hooks/useAnalytics";
import { formatNumber, formatRate } from "../utils/timeRange";

const TAB_LABEL: Record<AnalyticsScope, string> = {
  TENANT: "Products",
  PRODUCT: "Services",
  SERVICE: "Endpoints",
  ENDPOINT: "—",
};

const rowLabel = (item: AnalyticsRankingItem, scope: AnalyticsScope) => {
  if (scope === "SERVICE") {
    return `${item.method ?? ""} ${item.pathTemplate ?? ""}`.trim() || item.id;
  }
  return item.name ?? item.id;
};

export const AnalyticsRankingsTable = ({
  params,
  onRowClick,
}: {
  params: AnalyticsRankingsParams;
  onRowClick?: (item: AnalyticsRankingItem) => void;
}) => {
  const rankingsQuery = useAnalyticsRankingsQuery(params);
  const scope = params.scope;
  const items = rankingsQuery.rows;

  if (scope === "ENDPOINT") {
    return null;
  }

  return (
    <div className="flex min-h-48 flex-col gap-3 rounded-xl border border-border bg-background">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">
          Ranked {TAB_LABEL[scope].toLowerCase()}
        </h3>
      </div>
      <QueryGate
        isLoading={rankingsQuery.isLoading}
        isError={rankingsQuery.isError}
        errorMessage="Could not load rankings."
        className="px-4 py-8"
      >
        {items.length === 0 ? (
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
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      onRowClick
                        ? "cursor-pointer border-b border-border/60 hover:bg-muted/40"
                        : "border-b border-border/60"
                    }
                    onClick={() => onRowClick?.(item)}
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {rowLabel(item, scope)}
                    </td>
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
