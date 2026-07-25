import type { ReactNode } from 'react'
import { DataTableFilters } from './DataTableFilters'
import { DataTableSearch } from './DataTableSearch'
import type {
  DataTableColumn,
  DataTableFiltersConfig,
  DataTableSearchConfig,
} from './types'

type DataTableToolbarProps<T extends Record<string, unknown>> = {
  columns: DataTableColumn<T>[]
  searchConfig?: DataTableSearchConfig
  filtersConfig?: DataTableFiltersConfig
  toolbarActions?: ReactNode
}

export const DataTableToolbar = <T extends Record<string, unknown>>({
  columns,
  searchConfig,
  filtersConfig,
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
      {searchConfig ? (
        <DataTableSearch columns={columns} searchConfig={searchConfig} />
      ) : null}
      {hasRight ? (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {hasFilters && filtersConfig ? (
            <DataTableFilters columns={columns} filtersConfig={filtersConfig} />
          ) : null}
          {toolbarActions}
        </div>
      ) : null}
    </div>
  )
}
