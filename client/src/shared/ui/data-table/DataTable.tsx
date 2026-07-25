import { DataTablePaginationBar } from "./DataTablePagination";
import { AppliedFilterChips } from "./DataTableFilters";
import { DataTableTable } from "./DataTableTable";
import { DataTableToolbar } from "./DataTableToolbar";
import type { DataTableProps } from "./types";

export const DataTable = <T extends object>({
  columns,
  rows,
  getRowId,
  sortingConfig,
  searchConfig,
  filtersConfig,
  pagination,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
}: DataTableProps<T>) => {
  const hasFilterableColumns = columns.some((column) => column.filter != null);
  const hasSearchableColumns = columns.some((column) => column.searchable);
  const shouldShowToolbar =
    hasFilterableColumns || hasSearchableColumns || toolbarActions;

  return (
    <div className="flex flex-col gap-3">
      {shouldShowToolbar ? (
        <DataTableToolbar
          columns={columns}
          searchConfig={searchConfig}
          filtersConfig={filtersConfig}
          toolbarActions={toolbarActions}
        />
      ) : null}

      {hasFilterableColumns && filtersConfig ? (
        <AppliedFilterChips columns={columns} filtersConfig={filtersConfig} />
      ) : null}

      <div className="overflow-hidden rounded border border-border">
        <DataTableTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          sortingConfig={sortingConfig}
          rowActions={rowActions}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          skeletonRowCount={pagination?.pageSize}
        />
        {pagination ? <DataTablePaginationBar pagination={pagination} /> : null}
      </div>
    </div>
  );
};
