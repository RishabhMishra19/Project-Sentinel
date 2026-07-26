import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ExceptionMetricItem,
  StatusBreakdownItem,
} from '../dto/response/analytics.response'

const AXIS = { fontSize: 12, fill: 'var(--color-muted-foreground, #737373)' }
const GRID = 'var(--color-border, #e5e5e5)'
const BAR = '#0f766e'

export function EndpointStatusChart({ items }: { items: StatusBreakdownItem[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">Status codes</h3>
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No status data.</p>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="statusCode" tick={AXIS} />
              <YAxis tick={AXIS} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="requestCount" name="Requests" fill={BAR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function EndpointExceptionsChart({
  items,
}: {
  items: ExceptionMetricItem[]
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">Exceptions</h3>
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No exception data.
        </p>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis type="number" tick={AXIS} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="exceptionType"
                width={120}
                tick={AXIS}
              />
              <Tooltip />
              <Bar dataKey="exceptionCount" name="Count" fill="#b91c1c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
