import type { ListQueryRequest } from '../../../shared/api/listQueryRequest'
import { toListQueryRequest } from '../../../shared/api/toListQueryRequest'
import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { TenantSearchBy } from '../dto/request/tenant.request'

const SORTABLE_FIELDS = new Set(['name', 'slug', 'status', 'createdAt'])

const isSearchBy = (value: string): value is TenantSearchBy =>
  value === 'name' || value === 'slug'

export const mapTenantListQuery = (
  state: DataTableQueryState,
): ListQueryRequest =>
  toListQueryRequest(state, {
    sortableFields: SORTABLE_FIELDS,
    searchBy: { isSearchBy, defaultSearchBy: 'name' },
    dayBoundRange: true,
  })
