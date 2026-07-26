import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { rangeFromPreset } from '../../analytics/utils/timeRange'
import type { RequestLogResponse } from '../dto/response/requestLog.response'
import { useRequestLogQuery, useRequestLogsQuery } from '../hooks/useRequestLogs'

function statusTone(code: number) {
  if (code >= 500) return 'text-red-700'
  if (code >= 400) return 'text-amber-700'
  return 'text-foreground'
}

export function RequestLogsPage() {
  const [params, setParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const defaultRange = useMemo(() => rangeFromPreset('1h'), [])
  const from = params.get('from') ?? defaultRange.from
  const to = params.get('to') ?? defaultRange.to
  const productId = params.get('productId') ?? undefined
  const serviceId = params.get('serviceId') ?? undefined
  const endpointId = params.get('endpointId') ?? undefined
  const statusClass = params.get('statusClass') ?? undefined
  const traceId = params.get('traceId') ?? undefined
  const page = Number(params.get('page') ?? '0')

  const listParams = {
    from,
    to,
    productId,
    serviceId,
    endpointId,
    statusClass,
    traceId,
    page,
    size: 20,
    sort: 'occurredAt,desc',
  }

  const listQuery = useRequestLogsQuery(listParams)
  const detailQuery = useRequestLogQuery(selectedId)

  const patch = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(updates)) {
      if (v == null || v === '') next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  const rows = listQuery.data?.content ?? []
  const total = listQuery.data?.totalElements ?? 0

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Logs
        </h1>
        <p className="text-sm text-muted-foreground">
          Raw request events from the last 7 days.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-border p-4">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Status class
          <select
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={statusClass ?? ''}
            onChange={(e) =>
              patch({ statusClass: e.target.value || null, page: '0' })
            }
          >
            <option value="">All</option>
            <option value="2xx">2xx</option>
            <option value="4xx">4xx</option>
            <option value="5xx">5xx</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Trace ID
          <input
            className="min-w-[14rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            defaultValue={traceId ?? ''}
            placeholder="Paste trace id"
            onBlur={(e) =>
              patch({ traceId: e.target.value.trim() || null, page: '0' })
            }
          />
        </label>
        {(productId || serviceId || endpointId) && (
          <p className="self-end text-xs text-muted-foreground">
            Scoped filters active from Analytics.
            <button
              type="button"
              className="ml-2 underline"
              onClick={() =>
                patch({
                  productId: null,
                  serviceId: null,
                  endpointId: null,
                  page: '0',
                })
              }
            >
              Clear
            </button>
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {listQuery.isLoading ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">Loading…</p>
        ) : listQuery.isError ? (
          <p className="px-4 py-8 text-sm text-destructive">Could not load logs.</p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">No events found.</p>
        ) : (
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Service</th>
                <th className="px-4 py-2 font-medium">Endpoint</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Latency</th>
                <th className="px-4 py-2 font-medium">Trace</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-border/60 hover:bg-muted/40"
                  onClick={() => setSelectedId(row.id)}
                >
                  <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">
                    {new Date(row.occurredAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">{row.serviceName}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    {row.method} {row.pathTemplate}
                  </td>
                  <td className={`px-4 py-2.5 tabular-nums ${statusTone(row.statusCode)}`}>
                    {row.statusCode}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{row.durationMs} ms</td>
                  <td className="max-w-[10rem] truncate px-4 py-2.5 font-mono text-xs">
                    {row.traceId ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>
            {total} total · page {page + 1}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 0}
              className="rounded border border-border px-2 py-1 disabled:opacity-40"
              onClick={() => patch({ page: String(Math.max(0, page - 1)) })}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={(page + 1) * 20 >= total}
              className="rounded border border-border px-2 py-1 disabled:opacity-40"
              onClick={() => patch({ page: String(page + 1) })}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedId ? (
        <RequestLogDetailPanel
          log={detailQuery.data}
          loading={detailQuery.isLoading}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  )
}

function RequestLogDetailPanel({
  log,
  loading,
  onClose,
}: {
  log: RequestLogResponse | undefined
  loading: boolean
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
      <button type="button" className="flex-1" aria-label="Close" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto border-l border-border bg-background p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Request log</h2>
          <button type="button" className="text-sm underline" onClick={onClose}>
            Close
          </button>
        </div>
        {loading || !log ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <dl className="grid grid-cols-1 gap-3 text-sm">
            {[
              ['Occurred', new Date(log.occurredAt).toLocaleString()],
              ['Endpoint', `${log.method} ${log.pathTemplate}`],
              ['Service', log.serviceName],
              ['Product', log.productName],
              ['Status', String(log.statusCode)],
              ['Duration', `${log.durationMs} ms`],
              ['Trace', log.traceId ?? '—'],
              ['Request ID', log.requestId ?? '—'],
              ['User', log.userId ?? '—'],
              ['IP', log.endUserIp ?? '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 break-all font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </aside>
    </div>
  )
}
