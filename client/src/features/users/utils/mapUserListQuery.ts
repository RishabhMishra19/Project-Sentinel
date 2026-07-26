import {
  mapListQueryMeta,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import type { UserListParams, UserSearchBy } from '../dto/request/user.request'

const SORTABLE_FIELDS = new Set([
  'email',
  'displayName',
  'status',
  'createdAt',
])

const isSearchBy = (value: string): value is UserSearchBy =>
  value === 'email' || value === 'displayName'

export const mapUserListQuery = (state: DataTableQueryState): UserListParams =>
  ({
    ...mapListQueryMeta(state, SORTABLE_FIELDS, {
      isSearchBy,
      defaultSearchBy: 'email',
    }),
    ...state.apiFilters,
  }) as UserListParams
