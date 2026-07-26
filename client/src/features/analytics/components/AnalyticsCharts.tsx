import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsTimeseriesPoint } from "../dto/response/analytics.response";
import { ChartShell } from "./ChartShell";

const AXIS = { fontSize: 12, fill: "var(--color-muted-foreground, #737373)" };
const GRID = "var(--color-border, #e5e5e5)";
const SERIES = {
  volume: "#0f766e",
  error: "#b91c1c",
  p50: "#0369a1",
  p95: "#c2410c",
  p99: "#7c2d12",
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

export const AnalyticsVolumeChart = ({ points }: { points: AnalyticsTimeseriesPoint[] }) => {
  return (
    <ChartShell title="Request volume" xLabel="Time" yLabel="Requests" empty={points.length === 0}>
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

export const AnalyticsErrorRateChart = ({ points }: { points: AnalyticsTimeseriesPoint[] }) => {
  const data = points.map((p) => ({
    ...p,
    errorRatePct: Number((p.errorRate * 100).toFixed(3)),
  }));
  return (
    <ChartShell
      title="Error rate (%)"
      xLabel="Time"
      yLabel="Error rate (%)"
      empty={points.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={CHART_MARGIN}>
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

export const AnalyticsLatencyChart = ({ points }: { points: AnalyticsTimeseriesPoint[] }) => {
  return (
    <ChartShell
      title="Latency (ms)"
      xLabel="Time"
      yLabel="Latency (ms)"
      empty={points.length === 0}
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
