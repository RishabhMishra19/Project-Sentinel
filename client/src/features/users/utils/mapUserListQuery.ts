import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { UserListParams, UserSearchBy } from '../dto/request/user.request'
import type { UserStatus } from '../dto/response/user.response'

const SORTABLE_FIELDS = new Set([
  'email',
  'displayName',
  'status',
  'createdAt',
])

const isUserStatus = (value: unknown): value is UserStatus =>
  value === 'ACTIVE' || value === 'INACTIVE'

const isSearchBy = (value: string): value is UserSearchBy =>
  value === 'email' || value === 'displayName'

export const mapUserListQuery = (
  state: DataTableQueryState,
): UserListParams => {
  const params: UserListParams = {
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
      : 'email'
  }

  const statusFilter = state.filters.status
  if (isUserStatus(statusFilter)) {
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
