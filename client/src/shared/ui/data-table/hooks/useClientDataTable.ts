import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { useEffect, useMemo, type ReactNode } from "react";
import type { DataTableColumn, DataTableProps, RowAction } from "../types";
import { applyClientFilters } from "../utils/clientFiltering";
import type { DataTableQueryState } from "../utils/queryState";
import {
  buildDataTableProps,
  fromTanStackSorting,
  toTanStackSorting,
  useDataTableQueryState,
} from "./useDataTableQueryState";
import { buildTanStackColumns } from "../utils/tanstack";

type UseClientDataTableOptions<T extends object> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  initialState?: Partial<DataTableQueryState>;
  enablePagination?: boolean;
  rowActions?: RowAction<T>[];
  toolbarActions?: ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
};

type UseClientDataTableResult<T extends object> = {
  tableProps: DataTableProps<T>;
  query: DataTableQueryState;
};

export const useClientDataTable = <T extends object>({
  columns,
  data,
  getRowId,
  initialState,
  enablePagination = true,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
}: UseClientDataTableOptions<T>): UseClientDataTableResult<T> => {
  const { query, setSorting, setSearch, setFilters, setPageIndex, setPageSize } =
    useDataTableQueryState({ columns, initialState });

  const filteredData = useMemo(
    () => applyClientFilters(data, columns, query.search, query.filters),
    [data, columns, query.search, query.filters],
  );

  const tanstackColumns = useMemo(() => buildTanStackColumns(columns), [columns]);

  const sortingState = useMemo(() => toTanStackSorting(query.sorting), [query.sorting]);

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    }),
    [query.pageIndex, query.pageSize],
  );

  const table = useReactTable({
    data: filteredData,
    columns: tanstackColumns,
    state: {
      sorting: sortingState,
      pagination: paginationState,
    },
    getRowId: (row) => getRowId(row),
    onSortingChange: (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sortingState) : updater;
      setSorting(fromTanStackSorting(next));
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = typeof updater === "function" ? updater(paginationState) : updater;
      if (next.pageSize !== query.pageSize) {
        setPageSize(next.pageSize);
        return;
      }
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualFiltering: true,
    autoResetPageIndex: false,
  });

  const totalElements = filteredData.length;
  const pageCount = enablePagination
    ? Math.max(Math.ceil(totalElements / Math.max(query.pageSize, 1)), 1)
    : 1;

  useEffect(() => {
    if (query.pageIndex > pageCount - 1) {
      setPageIndex(Math.max(pageCount - 1, 0));
    }
  }, [query.pageIndex, pageCount, setPageIndex]);

  const rows = (enablePagination ? table.getRowModel().rows : table.getSortedRowModel().rows).map(
    (row) => row.original,
  );

  const tableProps = buildDataTableProps({
    columns,
    rows,
    getRowId,
    query,
    totalElements,
    enablePagination,
    rowActions,
    toolbarActions,
    isLoading,
    emptyMessage,
    onSortingChange: setSorting,
    onSearchChange: setSearch,
    onFiltersChange: setFilters,
    onPageIndexChange: setPageIndex,
    onPageSizeChange: setPageSize,
  });

  return { tableProps, query };
};
