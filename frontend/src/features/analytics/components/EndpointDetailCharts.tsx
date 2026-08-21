import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { QueryGate } from "../../../shared/ui";
import type { ExceptionMetricItem, StatusBreakdownItem } from "../dto/response/analytics.response";
import { useEndpointStatusBreakdownQuery } from "../hooks/useAnalytics";
import { ChartShell } from "./ChartShell";

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

export const EndpointStatusChart = ({
  endpointId,
  from,
  to,
}: {
  endpointId: string;
  from: string;
  to: string;
}) => {
  const statusQuery = useEndpointStatusBreakdownQuery(endpointId, from, to);

  return (
    <QueryGate
      isLoading={statusQuery.isLoading}
      isError={statusQuery.isError}
      errorMessage="Could not load status breakdown."
      className="min-h-56 rounded-xl border border-border bg-background"
    >
      <StatusChartContent items={statusQuery.data ?? []} />
    </QueryGate>
  );
};
