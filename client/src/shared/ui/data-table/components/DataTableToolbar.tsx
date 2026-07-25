import type { ReactNode } from 'react'
import { DataTableFilters } from './DataTableFilters'
import { DataTableSearch } from './DataTableSearch'
import { toFilterableColumns } from './DataTableFilters/filterUtils'
import type {
  DataTableColumn,
  DataTableFiltersConfig,
  DataTableSearchConfig,
} from '../types'

type DataTableToolbarProps<T extends object> = {
  columns: DataTableColumn<T>[]
  searchConfig?: DataTableSearchConfig
  filtersConfig?: DataTableFiltersConfig
  toolbarActions?: ReactNode
}

export const DataTableToolbar = <T extends object>({
  columns,
  searchConfig,
  filtersConfig,
  toolbarActions,
}: DataTableToolbarProps<T>) => {
  const searchableColumns = columns
    .filter((column) => column.searchable)
    .map((column) => ({ id: column.id, header: column.header }))
  const filterableColumns = toFilterableColumns(columns)

  const hasSearch = searchableColumns.length > 0 && searchConfig
  const hasFilters = filterableColumns.length > 0 && filtersConfig
  const hasRight = hasFilters || toolbarActions != null

  if (!hasSearch && !hasRight) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasSearch ? (
        <DataTableSearch
          columns={searchableColumns}
          searchConfig={searchConfig}
        />
      ) : null}
      {hasRight ? (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {hasFilters ? (
            <DataTableFilters
              columns={filterableColumns}
              filtersConfig={filtersConfig}
            />
          ) : null}
          {toolbarActions}
        </div>
      ) : null}
    </div>
  )
}
