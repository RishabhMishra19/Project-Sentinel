import { QueryGate } from "../../../shared/ui";
import { formatDouble, formatNumber } from "../../../shared/utils/numberUtils";
import { useAnalyticsSummaryQuery } from "../hooks/useAnalytics";
import { useAnalyticsUrlState } from "../hooks/useAnalyticsUrlState";

interface KpiProps {
  label: string;
  value: string;
  color: "red" | "green" | "grey" | "yellow";
}

const COLOR_CLASSES = {
  red: {
    bg: "bg-red-50",
    text: "text-red-500",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-500",
  },
  grey: {
    bg: "bg-gray-50",
    text: "text-gray-500",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-500",
  },
} as const;

const Kpi = ({ label, value, color }: KpiProps) => {
  const bgColorClass = COLOR_CLASSES[color].bg;
  const textColorClass = COLOR_CLASSES[color].text;

  return (
    <div
      className={`${bgColorClass} group rounded-md border border-border/60 bg-card/50 backdrop-blur-sm px-2 py-1 flex flex-row justify-between shadow-sm gap-4 items-center`}
    >
      <span
        className={`text-[10px] ${textColorClass} font-medium uppercase tracking-wider text-muted-foreground`}
      >
        {label}
      </span>
      <span
        className={`text-[10px] ${textColorClass} font-bold tracking-tight text-foreground tabular-nums`}
      >
        {value}
      </span>
    </div>
  );
};

export const AnalyticsKpiStrip = () => {
  const summaryQuery = useAnalyticsSummaryQuery();
  const summary = summaryQuery.data;

  return (
    <QueryGate
      isLoading={summaryQuery.isLoading}
      isError={summaryQuery.isError || (!summaryQuery.isLoading && !summary)}
      errorMessage="Could not load summary"
      className="min-h-[4.5rem]"
    >
      {summary ? (
        <div className="flex flex-row gap-2 p-0 m-0">
          <Kpi
            label="Total Requests"
            value={formatNumber(summary.totalStats.requestCount)}
            color="green"
          />
          <Kpi label="Error Rate" value={formatDouble(summary.totalStats.errorRate)} color="red" />
          <Kpi
            label="P95 Latency"
            value={
              summary.totalStats.latencyP95Ms != null
                ? `${summary.totalStats.latencyP95Ms} ms`
                : "—"
            }
            color="yellow"
          />
          {summary.endpointCount != null ? (
            <Kpi
              label="Active Endpoints"
              value={formatNumber(summary.endpointCount)}
              color="grey"
            />
          ) : null}
        </div>
      ) : null}
    </QueryGate>
  );
};
