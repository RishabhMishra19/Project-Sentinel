import type {
  DataTableFilterValue,
  DataTableSearchState,
  DataTableSort,
} from '../types'

export type DataTableQueryState = {
  pageIndex: number
  pageSize: number
  sorting: DataTableSort
  search: DataTableSearchState
  filters: Record<string, DataTableFilterValue>
}

export const DEFAULT_PAGE_SIZE = 10

export const createInitialQueryState = (
  columns: { id: string; searchable?: boolean }[],
  initial?: Partial<DataTableQueryState>,
): DataTableQueryState => {
  const firstSearchable = columns.find((column) => column.searchable)?.id ?? ''

  return {
    pageIndex: initial?.pageIndex ?? 0,
    pageSize: initial?.pageSize ?? DEFAULT_PAGE_SIZE,
    sorting: initial?.sorting ?? null,
    search: initial?.search ?? { columnId: firstSearchable, value: '' },
    filters: initial?.filters ?? {},
  }
}
