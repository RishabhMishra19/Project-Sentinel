import type { ReactNode } from 'react'
import { DataTableFilters } from './DataTableFilters'
import { DataTableSearch } from './DataTableSearch'
import type {
  DataTableColumn,
  DataTableFiltersConfig,
  DataTableSearchConfig,
} from './types'

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
  const hasSearch = searchableColumns.length > 0
  const hasFilters = columns.some((column) => column.filter != null)
  const hasRight = hasFilters || toolbarActions != null

  if (!hasSearch && !hasRight) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {searchConfig && hasSearch ? (
        <DataTableSearch
          columns={searchableColumns}
          searchConfig={searchConfig}
        />
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
