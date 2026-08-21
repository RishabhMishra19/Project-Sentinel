import { useAppSelector } from "../../../redux/hooks";
import { QueryGate } from "../../../shared/ui";
import type { AnalyticsQueryParams } from "../dto/request/analytics.request";
import { useAnalyticsSummaryQuery } from "../hooks/useAnalytics";
import { getSummaryRequestParams } from "../utils/analyticsUrl";
import { formatNumber, formatRate } from "../utils/timeRange";

const Kpi = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
};

export const AnalyticsKpiStrip = ({ params }: { params: AnalyticsQueryParams }) => {
  const tenantId = useAppSelector((state) => state.session.activeTenant?.id!);
  const summaryQuery = useAnalyticsSummaryQuery(getSummaryRequestParams(params, tenantId));
  const summary = summaryQuery.data;

  return (
    <QueryGate
      isLoading={summaryQuery.isLoading}
      isError={summaryQuery.isError || (!summaryQuery.isLoading && !summary)}
      errorMessage="Could not load summary."
      className="min-h-[4.5rem]"
    >
      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <Kpi label="Requests" value={formatNumber(summary.requestCount)} />
          <Kpi label="Error rate" value={formatRate(summary.errorRate)} />
          <Kpi
            label="p50"
            value={summary.latencyP50Ms != null ? `${summary.latencyP50Ms} ms` : "—"}
          />
          <Kpi
            label="p95"
            value={summary.latencyP95Ms != null ? `${summary.latencyP95Ms} ms` : "—"}
          />
          <Kpi
            label="p99"
            value={summary.latencyP99Ms != null ? `${summary.latencyP99Ms} ms` : "—"}
          />
          {summary.activeEndpointCount != null ? (
            <Kpi label="Active endpoints" value={formatNumber(summary.activeEndpointCount)} />
          ) : null}
        </div>
      ) : null}
    </QueryGate>
  );
};
