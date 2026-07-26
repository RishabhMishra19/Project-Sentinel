import type { DataTableQueryState } from '../utils/queryState'

type SearchByOptions<T extends string> = {
  isSearchBy: (value: string) => value is T
  defaultSearchBy: T
}

/** page / size / sort / q / searchBy — everything that is not encodeFilters. */
export const mapListQueryMeta = <TSearchBy extends string>(
  state: DataTableQueryState,
  sortableFields: Set<string>,
  searchBy?: SearchByOptions<TSearchBy>,
): {
  page: number
  size: number
  sort?: string
  q?: string
  searchBy?: TSearchBy
} => {
  const params: {
    page: number
    size: number
    sort?: string
    q?: string
    searchBy?: TSearchBy
  } = {
    page: state.pageIndex,
    size: state.pageSize,
  }

  if (state.sorting && sortableFields.has(state.sorting.id)) {
    params.sort = `${state.sorting.id},${state.sorting.desc ? 'desc' : 'asc'}`
  }

  if (searchBy) {
    const q = state.search.value.trim()
    if (q) {
      params.q = q
      params.searchBy = searchBy.isSearchBy(state.search.columnId)
        ? state.search.columnId
        : searchBy.defaultSearchBy
    }
  }

  return params
}
