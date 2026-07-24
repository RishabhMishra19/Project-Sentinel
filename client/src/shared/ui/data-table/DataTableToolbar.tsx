import type { ReactNode } from 'react'
import { DataTableFilters } from './DataTableFilters'
import { DataTableSearch } from './DataTableSearch'
import type {
  DataTableColumn,
  DataTableFilterValue,
  DataTableSearchState,
} from './types'

type DataTableToolbarProps<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  search?: DataTableSearchState
  onSearchChange?: (next: DataTableSearchState) => void
  filters?: Record<string, DataTableFilterValue>
  onFiltersChange?: (next: Record<string, DataTableFilterValue>) => void
  toolbarActions?: ReactNode
}

export const DataTableToolbar = <T extends Record<string, unknown>>({
  columns,
  search,
  onSearchChange,
  filters = {},
  onFiltersChange,
  toolbarActions,
}: DataTableToolbarProps<T>) => {
  const hasSearch = columns.some((column) => column.searchable)
  const hasFilters = columns.some((column) => column.filter != null)
  const hasRight = hasFilters || toolbarActions != null

  if (!hasSearch && !hasRight) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DataTableSearch
        columns={columns}
        search={search}
        onSearchChange={onSearchChange}
      />
      {hasRight ? (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {hasFilters ? (
            <DataTableFilters
              columns={columns}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          ) : null}
          {toolbarActions}
        </div>
      ) : null}
    </div>
  )
}
