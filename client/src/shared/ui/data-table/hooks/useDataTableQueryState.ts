import { useCallback, useState, type ReactNode } from 'react'
import type {
  DataTableColumn,
  DataTableFilterValue,
  DataTableProps,
  DataTableSearchState,
  DataTableSort,
  RowAction,
} from '../types'
import { createInitialQueryState, type DataTableQueryState } from './types'

type UseDataTableQueryStateOptions<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  initialState?: Partial<DataTableQueryState>
}

export const useDataTableQueryState = <T extends Record<string, unknown>>({
  columns,
  initialState,
}: UseDataTableQueryStateOptions<T>) => {
  const [query, setQuery] = useState<DataTableQueryState>(() =>
    createInitialQueryState(columns, initialState),
  )

  const setSorting = useCallback((sorting: DataTableSort) => {
    setQuery((prev) => ({ ...prev, sorting, pageIndex: 0 }))
  }, [])

  const setSearch = useCallback((search: DataTableSearchState) => {
    setQuery((prev) => ({ ...prev, search, pageIndex: 0 }))
  }, [])

  const setFilters = useCallback((filters: Record<string, DataTableFilterValue>) => {
    setQuery((prev) => ({ ...prev, filters, pageIndex: 0 }))
  }, [])

  const clearFilters = useCallback(() => {
    setQuery((prev) => ({ ...prev, filters: {}, pageIndex: 0 }))
  }, [])

  const setPageIndex = useCallback((pageIndex: number) => {
    setQuery((prev) => ({ ...prev, pageIndex }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageIndex: 0 }))
  }, [])

  return {
    query,
    setQuery,
    setSorting,
    setSearch,
    setFilters,
    clearFilters,
    setPageIndex,
    setPageSize,
  }
}

type BuildTablePropsInput<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  query: DataTableQueryState
  pageCount: number
  totalElements?: number
  enablePagination?: boolean
  rowActions?: RowAction<T>[]
  toolbarActions?: ReactNode
  isLoading?: boolean
  emptyMessage?: string
  onSortingChange: (next: DataTableSort) => void
  onSearchChange: (next: DataTableSearchState) => void
  onFiltersChange: (next: Record<string, DataTableFilterValue>) => void
  onFiltersClear: () => void
  onPageIndexChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const buildDataTableProps = <T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  query,
  pageCount,
  totalElements,
  enablePagination = true,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
  onSortingChange,
  onSearchChange,
  onFiltersChange,
  onFiltersClear,
  onPageIndexChange,
  onPageSizeChange,
}: BuildTablePropsInput<T>): DataTableProps<T> => {
  const props: DataTableProps<T> = {
    columns,
    rows,
    getRowId,
    sorting: query.sorting,
    onSortingChange,
    search: query.search,
    onSearchChange,
    filters: query.filters,
    onFiltersChange,
    onFiltersClear,
    rowActions,
    toolbarActions,
    isLoading,
    emptyMessage,
  }

  if (enablePagination) {
    props.pagination = {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      pageCount,
      totalElements,
      onPageIndexChange,
      onPageSizeChange,
    }
  }

  return props
}

export const toTanStackSorting = (sorting: DataTableSort) =>
  sorting ? [{ id: sorting.id, desc: sorting.desc }] : []

export const fromTanStackSorting = (
  sorting: { id: string; desc: boolean }[],
): DataTableSort => {
  const first = sorting[0]
  if (!first) {
    return null
  }
  return { id: first.id, desc: first.desc }
}
