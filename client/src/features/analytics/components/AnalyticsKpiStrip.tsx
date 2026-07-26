import type { AnalyticsSummaryResponse } from "../dto/response/analytics.response";
import { formatNumber, formatRate } from "../utils/timeRange";

const Kpi = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
};

export const AnalyticsKpiStrip = ({
  summary,
}: {
  summary: AnalyticsSummaryResponse | undefined;
}) => {
  if (!summary) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[4.5rem] animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <Kpi label="Requests" value={formatNumber(summary.requestCount)} />
      <Kpi label="Error rate" value={formatRate(summary.errorRate)} />
      <Kpi label="p50" value={summary.latencyP50Ms != null ? `${summary.latencyP50Ms} ms` : "—"} />
      <Kpi label="p95" value={summary.latencyP95Ms != null ? `${summary.latencyP95Ms} ms` : "—"} />
      <Kpi label="p99" value={summary.latencyP99Ms != null ? `${summary.latencyP99Ms} ms` : "—"} />
      {summary.activeEndpointCount != null ? (
        <Kpi label="Active endpoints" value={formatNumber(summary.activeEndpointCount)} />
      ) : null}
    </div>
  );
};
