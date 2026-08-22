import type { AnalyticsStatsMetrics } from "../dto/response/analytics.response";
import { useAnalyticsUrlState } from "../hooks/useAnalyticsUrlState";
import { AnalyticsScope } from "../utils/analytics.constants";

type AnalyticsRankingTableProps = {
  title: string;
  entityLabel: string;
  items: AnalyticsStatsMetrics[];
};

const formatCount = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
};

const formatLatency = (value: number) => {
  return `${value} ms`;
};

export const AnalyticsRankingTable = ({
  title,
  entityLabel,
  items,
}: AnalyticsRankingTableProps) => {
  const { validState, updateState } = useAnalyticsUrlState();

  const handleNavigate = (entityId: string) => {
    switch (validState.scope) {
      case AnalyticsScope.TENANT: {
        updateState({ ...validState, scope: AnalyticsScope.PRODUCT, productId: entityId });
        break;
      }
      case AnalyticsScope.PRODUCT: {
        updateState({ ...validState, scope: AnalyticsScope.SERVICE, serviceId: entityId });
        break;
      }
      case AnalyticsScope.SERVICE: {
        updateState({ ...validState, scope: AnalyticsScope.ENDPOINT, endpointId: entityId });
        break;
      }
    }
  };

  return (
    <div className="rounded-lg border border-border/60 bg-card/50 shadow-sm w-[49%]">
      <div className="border-b border-border/60 px-4 py-2">
        <div className="flex justify-between">
          <h3 className="text-sm font-semibold">{title}</h3>
          {items.length > 0 && (
            <span
              className="text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-100 p-1 rounded-sm"
              onClick={(e) => handleNavigate(items[0]?.entityId)}
            >
              View all
            </span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No data available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs tracking-wider text-muted-foreground bg-gray-100">
                <th className="px-4 py-2 text-left font-medium">{entityLabel}</th>

                <th className="px-4 py-2 text-right font-medium">Requests</th>

                <th className="px-4 py-2 text-right font-medium">Error %</th>

                <th className="px-4 py-2 text-right font-medium">P95</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.entityId}
                  className="border-b border-border/40 last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => handleNavigate(item.entityId)}
                >
                  <td className="max-w-[240px] truncate px-4 py-2 font-medium">{item.entityId}</td>

                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatCount(item.requestCount)}
                  </td>

                  <td className="px-4 py-2 text-right tabular-nums">
                    {item.errorRate.toFixed(1)}%
                  </td>

                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatLatency(item.latencyP95Ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
