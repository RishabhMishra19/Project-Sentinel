import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { ProductListParams, ProductSearchBy } from '../dto/request/product.request'
import type { ProductStatus } from '../dto/response/product.response'

const SORTABLE_FIELDS = new Set(['name', 'status', 'createdAt'])

const isProductStatus = (value: unknown): value is ProductStatus =>
  value === 'ACTIVE' || value === 'INACTIVE'

const isSearchBy = (value: string): value is ProductSearchBy => value === 'name'

export const mapProductListQuery = (
  state: DataTableQueryState,
): ProductListParams => {
  const params: ProductListParams = {
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
  if (isProductStatus(statusFilter)) {
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
