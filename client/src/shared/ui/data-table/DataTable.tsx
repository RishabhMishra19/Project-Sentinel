import { DataTablePaginationBar } from './DataTablePagination'
import { AppliedFilterChips } from './DataTableFilters'
import { DataTableTable } from './DataTableTable'
import { DataTableToolbar } from './DataTableToolbar'
import type { DataTableProps } from './types'

export const DataTable = <T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  sorting,
  onSortingChange,
  search,
  onSearchChange,
  filters = {},
  onFiltersChange,
  onFiltersClear,
  pagination,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
}: DataTableProps<T>) => {
  const hasFilterableColumns = columns.some((column) => column.filter != null)

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        columns={columns}
        search={search}
        onSearchChange={onSearchChange}
        filters={filters}
        onFiltersChange={onFiltersChange}
        toolbarActions={toolbarActions}
      />

      {hasFilterableColumns ? (
        <AppliedFilterChips
          columns={columns}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onFiltersClear={onFiltersClear}
        />
      ) : null}

      <div className="overflow-hidden rounded border border-border">
        <DataTableTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          sorting={sorting}
          onSortingChange={onSortingChange}
          rowActions={rowActions}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          skeletonRowCount={pagination?.pageSize}
        />
        {pagination ? <DataTablePaginationBar pagination={pagination} /> : null}
      </div>
    </div>
  )
}
