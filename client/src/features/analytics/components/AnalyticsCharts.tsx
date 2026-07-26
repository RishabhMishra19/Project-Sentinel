import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AnalyticsTimeseriesPoint } from '../dto/response/analytics.response'

const AXIS = { fontSize: 12, fill: 'var(--color-muted-foreground, #737373)' }
const GRID = 'var(--color-border, #e5e5e5)'
const SERIES = {
  volume: '#0f766e',
  error: '#b91c1c',
  p50: '#0369a1',
  p95: '#c2410c',
  p99: '#7c2d12',
}
const CHART_MARGIN = { top: 8, right: 12, bottom: 4, left: 4 }

function formatTick(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type ChartShellProps = {
  title: string
  xLabel: string
  yLabel: string
  children: React.ReactNode
  empty?: boolean
}

function ChartShell({ title, xLabel, yLabel, children, empty }: ChartShellProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {empty ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No data in this range.
        </p>
      ) : (
        <div className="flex gap-1">
          <div className="relative w-6 shrink-0 self-stretch">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs text-muted-foreground">
              {yLabel}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="h-64 w-full">{children}</div>
            <p className="text-center text-xs text-muted-foreground">{xLabel}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function AnalyticsVolumeChart({
  points,
}: {
  points: AnalyticsTimeseriesPoint[]
}) {
  return (
    <ChartShell
      title="Request volume"
      xLabel="Time"
      yLabel="Requests"
      empty={points.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="bucketStart"
            tickFormatter={formatTick}
            tick={AXIS}
            minTickGap={32}
          />
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
  )
}

export function AnalyticsErrorRateChart({
  points,
}: {
  points: AnalyticsTimeseriesPoint[]
}) {
  const data = points.map((p) => ({
    ...p,
    errorRatePct: Number((p.errorRate * 100).toFixed(3)),
  }))
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
          <XAxis
            dataKey="bucketStart"
            tickFormatter={formatTick}
            tick={AXIS}
            minTickGap={32}
          />
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
  )
}

export function AnalyticsLatencyChart({
  points,
}: {
  points: AnalyticsTimeseriesPoint[]
}) {
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
          <XAxis
            dataKey="bucketStart"
            tickFormatter={formatTick}
            tick={AXIS}
            minTickGap={32}
          />
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
  )
}
