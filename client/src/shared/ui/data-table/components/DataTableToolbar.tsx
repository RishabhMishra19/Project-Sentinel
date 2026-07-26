import type { ReactNode } from 'react'
import { Filters, toFilterFields } from '../../filters'
import type { FiltersConfig } from '../../filters'
import { DataTableSearch } from './DataTableSearch'
import type { DataTableColumn, DataTableSearchConfig } from '../types'

type DataTableToolbarProps<T extends object> = {
  columns: DataTableColumn<T>[]
  searchConfig?: DataTableSearchConfig
  filtersConfig?: FiltersConfig
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
  const filterFields = toFilterFields(columns)

  const hasSearch = searchableColumns.length > 0 && searchConfig
  const hasFilters = filterFields.length > 0 && filtersConfig
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
            <Filters fields={filterFields} filtersConfig={filtersConfig} />
          ) : null}
          {toolbarActions}
        </div>
      ) : null}
    </div>
  )
}
