import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { ServiceApiKeyListParams } from '../dto/request/apikey.request'
import type { ServiceApiKeyStatus } from '../dto/response/apikey.response'

const SORTABLE_FIELDS = new Set(['name', 'status', 'createdAt', 'revokedAt'])

const isApiKeyStatus = (value: unknown): value is ServiceApiKeyStatus =>
  value === 'ACTIVE' || value === 'REVOKED'

export const mapApiKeyListQuery = (
  state: DataTableQueryState,
): ServiceApiKeyListParams => {
  const params: ServiceApiKeyListParams = {
    page: state.pageIndex,
    size: state.pageSize,
  }

  if (state.sorting && SORTABLE_FIELDS.has(state.sorting.id)) {
    params.sort = `${state.sorting.id},${state.sorting.desc ? 'desc' : 'asc'}`
  }

  const statusFilter = state.filters.status
  if (isApiKeyStatus(statusFilter)) {
    params.status = statusFilter
  }

  return params
}
