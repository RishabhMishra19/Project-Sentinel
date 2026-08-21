import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { QueryGate } from "../../../shared/ui";
import type { StatusBreakdownItem } from "../dto/response/analytics.response";
import { useAnalyticsSummaryQuery } from "../hooks/useAnalytics";
import { ChartShell } from "./ChartShell";
import type { AnalyticsQueryParams } from "../dto/request/analytics.request";
import { getSummaryRequestParams } from "../utils/analyticsUrl";
import { useAppSelector } from "../../../redux/hooks";

const AXIS = { fontSize: 12, fill: "var(--color-muted-foreground, #737373)" };
const GRID = "var(--color-border, #e5e5e5)";
const BAR = "#0f766e";
const CHART_MARGIN = { top: 8, right: 12, bottom: 4, left: 4 };

const StatusChartContent = ({ items }: { items: StatusBreakdownItem[] }) => {
  return (
    <ChartShell
      title="Status codes"
      xLabel="Status code"
      yLabel="Requests"
      empty={items.length === 0}
      emptyMessage="No status data."
      heightClassName="h-56"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="statusCode" tick={AXIS} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="requestCount" name="Requests" fill={BAR} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

export const EndpointStatusChart = ({ params }: { params: AnalyticsQueryParams }) => {
  const tenantId = useAppSelector((state) => state.session.activeTenant?.id!);
  const statusQuery = useAnalyticsSummaryQuery(getSummaryRequestParams(params, tenantId));

  const items: StatusBreakdownItem[] = [
    {
      requestCount: statusQuery.data?.status2xx ?? 0,
      statusCode: "2xx",
    },
    {
      requestCount: statusQuery.data?.status3xx ?? 0,
      statusCode: "3xx",
    },
    {
      requestCount: statusQuery.data?.status4xx ?? 0,
      statusCode: "4xx",
    },
    {
      requestCount: statusQuery.data?.status5xx ?? 0,
      statusCode: "5xx",
    },
  ];

  return (
    <QueryGate
      isLoading={statusQuery.isLoading}
      isError={statusQuery.isError}
      errorMessage="Could not load status breakdown."
      className="min-h-56 rounded-xl border border-border bg-background"
    >
      <StatusChartContent items={items} />
    </QueryGate>
  );
};
