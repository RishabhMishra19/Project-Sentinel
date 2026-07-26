import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ExceptionMetricItem, StatusBreakdownItem } from "../dto/response/analytics.response";

const AXIS = { fontSize: 12, fill: "var(--color-muted-foreground, #737373)" };
const GRID = "var(--color-border, #e5e5e5)";
const BAR = "#0f766e";
const CHART_MARGIN = { top: 8, right: 12, bottom: 4, left: 4 };

function ChartFrame({
  title,
  xLabel,
  yLabel,
  empty,
  emptyMessage,
  children,
}: {
  title: string;
  xLabel: string;
  yLabel: string;
  empty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {empty ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="flex gap-1">
          <div className="relative w-6 shrink-0 self-stretch">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs text-muted-foreground">
              {yLabel}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="h-56 w-full">{children}</div>
            <p className="text-center text-xs text-muted-foreground">{xLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function EndpointStatusChart({ items }: { items: StatusBreakdownItem[] }) {
  return (
    <ChartFrame
      title="Status codes"
      xLabel="Status code"
      yLabel="Requests"
      empty={items.length === 0}
      emptyMessage="No status data."
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
    </ChartFrame>
  );
}

export function EndpointExceptionsChart({ items }: { items: ExceptionMetricItem[] }) {
  return (
    <ChartFrame
      title="Exceptions"
      xLabel="Exception type"
      yLabel="Count"
      empty={items.length === 0}
      emptyMessage="No exception data."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={{ ...CHART_MARGIN, bottom: 48 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="exceptionType"
            tick={AXIS}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="exceptionCount" name="Count" fill="#b91c1c" />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
