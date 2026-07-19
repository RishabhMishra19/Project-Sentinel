import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ClientTableProps } from "../types";
import { useTableState } from "./useTableState";

export function useClientTable<TData>({ data, columns }: ClientTableProps<TData>) {
  const tableState = useTableState();

  const table = useReactTable({
    data,
    columns,
    state: tableState.state,

    onPaginationChange: tableState.setPagination,
    onSortingChange: tableState.setSorting,
    onColumnFiltersChange: tableState.setColumnFilters,
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onRowSelectionChange: tableState.setRowSelection,
    onGlobalFilterChange: tableState.setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    ...tableState,
  };
}
