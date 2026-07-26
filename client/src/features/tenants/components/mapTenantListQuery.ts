import {
  mapListQueryMeta,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import type {
  TenantListParams,
  TenantSearchBy,
} from '../dto/request/tenant.request'

const SORTABLE_FIELDS = new Set(['name', 'slug', 'status', 'createdAt'])

const isSearchBy = (value: string): value is TenantSearchBy =>
  value === 'name' || value === 'slug'

export const mapTenantListQuery = (
  state: DataTableQueryState,
): TenantListParams =>
  ({
    ...mapListQueryMeta(state, SORTABLE_FIELDS, {
      isSearchBy,
      defaultSearchBy: 'name',
    }),
    ...state.apiFilters,
  }) as TenantListParams
