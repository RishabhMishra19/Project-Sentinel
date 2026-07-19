"use no memo";

import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import type { DataTableRequest, DataTableResponse, ServerTableProps } from "../types";
import { useTableState } from "./useTableState";

export function useServerTable<TData>({ columns, fetchData }: ServerTableProps<TData>) {
  const tableState = useTableState();

  const [rows, setRows] = useState<TData[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const buildRequest = useCallback((): DataTableRequest => {
    return {
      page: tableState.pagination.pageIndex,
      size: tableState.pagination.pageSize,
      search: tableState.globalFilter,
      sorting: tableState.sorting,
      filters: tableState.columnFilters,
    };
  }, [
    tableState.pagination,
    tableState.globalFilter,
    tableState.sorting,
    tableState.columnFilters,
  ]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response: DataTableResponse<TData> = await fetchData(buildRequest());

      setRows(response.items);
      setTotalItems(response.totalItems);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchData, buildRequest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const table = useReactTable({
    data: rows,
    columns,

    state: tableState.state,

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    pageCount: Math.ceil(totalItems / tableState.pagination.pageSize),

    getCoreRowModel: getCoreRowModel(),

    onPaginationChange: tableState.setPagination,
    onSortingChange: tableState.setSorting,
    onColumnFiltersChange: tableState.setColumnFilters,
    onColumnVisibilityChange: tableState.setColumnVisibility,
    onRowSelectionChange: tableState.setRowSelection,
    onGlobalFilterChange: tableState.setGlobalFilter,
  });

  return {
    table,
    rows,

    loading,
    error,

    totalItems,

    refetch: loadData,

    ...tableState,
  };
}
