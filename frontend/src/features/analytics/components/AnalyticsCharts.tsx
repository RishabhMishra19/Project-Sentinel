import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartShell } from "./ChartShell";
import type {
  AnalyticsSummaryResponse,
  AnalyticsTimeSeriesResponse,
} from "../dto/response/analytics.response";

const AXIS = { fontSize: 12, fill: "var(--color-muted-foreground, #737373)" };
const GRID = "var(--color-border, #e5e5e5)";
const SERIES = {
  volume: "#0f766e",
  error: "#b91c1c",
  p50: "#0369a1",
  p95: "#c2410c",
  p99: "#7c2d12",
};
const BAR: { [key: string]: string } = {
  ["2xx"]: "#0f766e",
  ["3xx"]: "#e7f05e",
  ["4xx"]: "#ac5c41",
  ["5xx"]: "#b30000",
};
const CHART_MARGIN = { top: 8, right: 12, bottom: 4, left: 4 };

const formatTick = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AnalyticsVolumeChart = ({
  data,
  isLoading,
  isError,
  errorMessage,
}: {
  data?: AnalyticsTimeSeriesResponse;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) => {
  const points = data?.timeSeriesStats ?? [];
  return (
    <ChartShell
      title="Request volume"
      xLabel="Time"
      yLabel="Requests"
      {...{ isLoading, isError, errorMessage, isEmpty: points.length === 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="bucketStart" tickFormatter={formatTick} tick={AXIS} minTickGap={32} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip labelFormatter={(v) => formatTick(String(v))} />
          <Line
            type="monotone"
            dataKey="requestCount"
            name="Requests"
            stroke={SERIES.volume}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

export const AnalyticsErrorRateChart = ({
  data,
  isLoading,
  isError,
  errorMessage,
}: {
  data?: AnalyticsTimeSeriesResponse;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) => {
  const points = (data?.timeSeriesStats ?? []).map((p) => ({
    ...p,
    errorRatePct: Number((p.errorRate * 100).toFixed(3)),
  }));
  return (
    <ChartShell
      title="Error rate (%)"
      xLabel="Time"
      yLabel="Error rate (%)"
      {...{ isLoading, isError, errorMessage, isEmpty: points.length === 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="bucketStart" tickFormatter={formatTick} tick={AXIS} minTickGap={32} />
          <YAxis tick={AXIS} />
          <Tooltip labelFormatter={(v) => formatTick(String(v))} />
          <Line
            type="monotone"
            dataKey="errorRatePct"
            name="Error %"
            stroke={SERIES.error}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

export const AnalyticsLatencyChart = ({
  data,
  isLoading,
  isError,
  errorMessage,
}: {
  data?: AnalyticsTimeSeriesResponse;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) => {
  const points = data?.timeSeriesStats ?? [];
  return (
    <ChartShell
      title="Latency (ms)"
      xLabel="Time"
      yLabel="Latency (ms)"
      {...{ isLoading, isError, errorMessage, isEmpty: points.length === 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ ...CHART_MARGIN, top: 4 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="bucketStart" tickFormatter={formatTick} tick={AXIS} minTickGap={32} />
          <YAxis tick={AXIS} />
          <Tooltip labelFormatter={(v) => formatTick(String(v))} />
          <Legend verticalAlign="top" height={28} />
          <Line
            type="monotone"
            dataKey="latencyP50Ms"
            name="p50"
            stroke={SERIES.p50}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="latencyP95Ms"
            name="p95"
            stroke={SERIES.p95}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="latencyP99Ms"
            name="p99"
            stroke={SERIES.p99}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

export const AnalyticsStatusChart = ({
  data,
  isLoading,
  isError,
  errorMessage,
}: {
  data?: AnalyticsSummaryResponse;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}) => {
  const items = [
    {
      requestCount: data?.totalStats.status2xx ?? 0,
      statusCode: "2xx",
    },
    {
      requestCount: data?.totalStats.status3xx ?? 0,
      statusCode: "3xx",
    },
    {
      requestCount: data?.totalStats.status4xx ?? 0,
      statusCode: "4xx",
    },
    {
      requestCount: data?.totalStats.status5xx ?? 0,
      statusCode: "5xx",
    },
  ];

  return (
    <ChartShell
      title="Status codes"
      xLabel="Status code"
      yLabel="Requests"
      {...{ isLoading, isError, errorMessage, isEmpty: !data?.totalStats.requestCount }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="statusCode" tick={AXIS} />
          <YAxis tick={AXIS} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="requestCount" name="Requests">
            {items.map((item) => (
              <Cell fill={BAR[item.statusCode]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};
