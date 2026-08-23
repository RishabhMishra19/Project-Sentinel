import { AppliedFilterChips, toFilterFields } from "../filters";
import { DataTableCursorPaginationBar } from "./components/DataTableCursorPagination";
import { DataTablePaginationBar } from "./components/DataTablePagination";
import { DataTableTable } from "./components/DataTableTable";
import { DataTableToolbar } from "./components/DataTableToolbar";
import type { DataTableProps } from "./types";

export const DataTable = <T extends object>({
  columns,
  rows,
  getRowId,
  sortingConfig,
  searchConfig,
  filtersConfig,
  pagination,
  cursorPagination,
  onScrollEnd,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
}: DataTableProps<T>) => {
  const filterFields = toFilterFields(columns);
  const hasFilterableColumns = filterFields.length > 0;
  const hasSearchableColumns = columns.some((column) => column.searchable);
  const shouldShowToolbar = hasFilterableColumns || hasSearchableColumns || toolbarActions;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
      {shouldShowToolbar ? (
        <DataTableToolbar
          columns={columns}
          searchConfig={searchConfig}
          filtersConfig={filtersConfig}
          toolbarActions={toolbarActions}
        />
      ) : null}

      {hasFilterableColumns && filtersConfig ? (
        <AppliedFilterChips fields={filterFields} filtersConfig={filtersConfig} />
      ) : null}

      <div className="rounded border border-border flex-1 min-h-0 flex flex-col">
        <DataTableTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          sortingConfig={sortingConfig}
          rowActions={rowActions}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          skeletonRowCount={pagination?.pageSize}
          onScrollEnd={onScrollEnd}
        />
        {cursorPagination ? (
          <DataTableCursorPaginationBar cursorPagination={cursorPagination} />
        ) : pagination ? (
          <DataTablePaginationBar pagination={pagination} />
        ) : null}
      </div>
    </div>
  );
};
