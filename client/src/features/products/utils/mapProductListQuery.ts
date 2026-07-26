import {
  mapListQueryMeta,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import type {
  ProductListParams,
  ProductSearchBy,
} from '../dto/request/product.request'

const SORTABLE_FIELDS = new Set(['name', 'status', 'createdAt'])

const isSearchBy = (value: string): value is ProductSearchBy => value === 'name'

export const mapProductListQuery = (
  state: DataTableQueryState,
): ProductListParams =>
  ({
    ...mapListQueryMeta(state, SORTABLE_FIELDS, {
      isSearchBy,
      defaultSearchBy: 'name',
    }),
    ...state.apiFilters,
  }) as ProductListParams
