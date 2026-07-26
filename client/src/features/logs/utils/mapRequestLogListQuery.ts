import {
  mapListQueryMeta,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import { dateTimeRangeFromPreset } from '../../../shared/ui/filters'
import { clampLogsRange } from '../../analytics/utils/timeRange'
import type { RequestLogListParams } from '../dto/request/requestLog.request'

const SORTABLE_FIELDS = new Set(['occurredAt', 'durationMs'])

const datetimeLocalToIso = (local: string): string | null => {
  const d = new Date(local)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

const defaultLogsRange = (): { from: string; to: string } => {
  const range = dateTimeRangeFromPreset('24h')
  return {
    from: datetimeLocalToIso(range.from)!,
    to: datetimeLocalToIso(range.to)!,
  }
}

export const mapRequestLogListQuery = (
  state: DataTableQueryState,
): RequestLogListParams => {
  const meta = mapListQueryMeta(state, SORTABLE_FIELDS)
  const params: RequestLogListParams = {
    page: meta.page,
    size: meta.size,
    sort: meta.sort ?? 'occurredAt,desc',
    ...state.apiFilters,
  }

  const fallback = defaultLogsRange()
  const clamped = clampLogsRange(
    state.apiFilters.from ?? fallback.from,
    state.apiFilters.to ?? fallback.to,
  )
  params.from = clamped.from
  params.to = clamped.to

  const searchValue = state.search.value.trim()
  if (searchValue && state.search.columnId === 'traceId') {
    params.traceId = searchValue
  }

  return params
}
