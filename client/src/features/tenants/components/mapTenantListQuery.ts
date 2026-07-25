import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { TenantListParams, TenantSearchBy } from '../dto/request/tenant.request'
import type { TenantStatus } from '../dto/response/tenant.response'

const SORTABLE_FIELDS = new Set(['name', 'slug', 'status', 'createdAt'])

const isTenantStatus = (value: unknown): value is TenantStatus =>
  value === 'ACTIVE' || value === 'INACTIVE'

const isSearchBy = (value: string): value is TenantSearchBy =>
  value === 'name' || value === 'slug'

export const mapTenantListQuery = (
  state: DataTableQueryState,
): TenantListParams => {
  const params: TenantListParams = {
    page: state.pageIndex,
    size: state.pageSize,
  }

  if (state.sorting && SORTABLE_FIELDS.has(state.sorting.id)) {
    params.sort = `${state.sorting.id},${state.sorting.desc ? 'desc' : 'asc'}`
  }

  const q = state.search.value.trim()
  if (q) {
    params.q = q
    params.searchBy = isSearchBy(state.search.columnId)
      ? state.search.columnId
      : 'name'
  }

  const statusFilter = state.filters.status
  if (isTenantStatus(statusFilter)) {
    params.status = statusFilter
  }

  const createdAt = state.filters.createdAt
  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'from' in createdAt &&
    'to' in createdAt
  ) {
    const range = createdAt as { from: string | null; to: string | null }
    if (range.from) {
      params.createdFrom = range.from
    }
    if (range.to) {
      params.createdTo = range.to
    }
  }

  return params
}
