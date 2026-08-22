import type { AnalyticsStatsMetrics } from "../dto/response/analytics.response";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatAverageBytes = (bytes: number, count: number) => {
  if (count === 0) return "0 B";

  return formatBytes(bytes / count);
};

type TrafficSummaryProps = {
  totalStats?: AnalyticsStatsMetrics;
};

export const TrafficSummary = ({ totalStats }: TrafficSummaryProps) => {
  const requestBytesTotal = totalStats?.requestBytesTotal ?? 0;
  const responseBytesTotal = totalStats?.responseBytesTotal ?? 0;
  const requestCount = totalStats?.requestCount ?? 0;

  const items = [
    {
      label: "Total Requests Size",
      value: formatBytes(requestBytesTotal),
    },
    {
      label: "Total Responses Size",
      value: formatBytes(responseBytesTotal),
    },
    {
      label: "Avg Request Size",
      value: formatAverageBytes(requestBytesTotal, requestCount),
    },
    {
      label: "Avg Response Size",
      value: formatAverageBytes(responseBytesTotal, requestCount),
    },
  ];

  return (
    <div className="rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-y divide-border/60 md:grid-cols-4 md:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>

            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
