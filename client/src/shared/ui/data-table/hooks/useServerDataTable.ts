import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type {
  DataTableColumn,
  DataTableProps,
  RowAction,
} from '../types'
import { buildTanStackColumns } from './buildTanStackColumns'
import type { DataTableQueryState } from './types'
import {
  buildDataTableProps,
  fromTanStackSorting,
  toTanStackSorting,
  useDataTableQueryState,
} from './useDataTableQueryState'

type UseServerDataTableOptions<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  pageCount: number
  totalElements?: number
  initialState?: Partial<DataTableQueryState>
  rowActions?: RowAction<T>[]
  toolbarActions?: ReactNode
  isLoading?: boolean
  emptyMessage?: string
  searchDebounceMs?: number
  onQueryChange?: (query: DataTableQueryState) => void
}

type UseServerDataTableResult<T extends Record<string, unknown>> = {
  tableProps: DataTableProps<T>
  query: DataTableQueryState
}

export const useServerDataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  pageCount,
  totalElements,
  initialState,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
  searchDebounceMs = 300,
  onQueryChange,
}: UseServerDataTableOptions<T>): UseServerDataTableResult<T> => {
  const {
    query,
    setSorting,
    setSearch,
    setFilters,
    clearFilters,
    setPageIndex,
    setPageSize,
  } = useDataTableQueryState({ columns, initialState })

  const [debouncedSearchValue, setDebouncedSearchValue] = useState(
    query.search.value,
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchValue(query.search.value)
    }, searchDebounceMs)
    return () => window.clearTimeout(timer)
  }, [query.search.value, searchDebounceMs])

  const emittedQuery = useMemo<DataTableQueryState>(
    () => ({
      ...query,
      search: { ...query.search, value: debouncedSearchValue },
    }),
    [query, debouncedSearchValue],
  )

  const onQueryChangeRef = useRef(onQueryChange)
  onQueryChangeRef.current = onQueryChange

  useEffect(() => {
    onQueryChangeRef.current?.(emittedQuery)
  }, [emittedQuery])

  const tanstackColumns = useMemo(
    () => buildTanStackColumns(columns),
    [columns],
  )

  const sortingState = useMemo(
    () => toTanStackSorting(query.sorting),
    [query.sorting],
  )

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    }),
    [query.pageIndex, query.pageSize],
  )

  useReactTable({
    data,
    columns: tanstackColumns,
    pageCount,
    state: {
      sorting: sortingState,
      pagination: paginationState,
    },
    getRowId: (row) => getRowId(row),
    onSortingChange: (updater: Updater<SortingState>) => {
      const next =
        typeof updater === 'function' ? updater(sortingState) : updater
      setSorting(fromTanStackSorting(next))
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === 'function' ? updater(paginationState) : updater
      if (next.pageSize !== query.pageSize) {
        setPageSize(next.pageSize)
        return
      }
      setPageIndex(next.pageIndex)
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: false,
  })

  const tableProps = buildDataTableProps({
    columns,
    rows: data,
    getRowId,
    query,
    pageCount: Math.max(pageCount, 1),
    totalElements,
    enablePagination: true,
    rowActions,
    toolbarActions,
    isLoading,
    emptyMessage,
    onSortingChange: setSorting,
    onSearchChange: setSearch,
    onFiltersChange: setFilters,
    onFiltersClear: clearFilters,
    onPageIndexChange: setPageIndex,
    onPageSizeChange: setPageSize,
  })

  return { tableProps, query: emittedQuery }
}
