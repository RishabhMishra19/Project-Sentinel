import { useState } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

import type { DataTableState } from "../types";

interface UseTableStateOptions {
  initialPageSize?: number;
}

export function useTableState({ initialPageSize = 10 }: UseTableStateOptions = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const state: DataTableState = {
    pagination,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
  };

  return {
    state,

    pagination,
    setPagination,

    sorting,
    setSorting,

    columnFilters,
    setColumnFilters,

    columnVisibility,
    setColumnVisibility,

    rowSelection,
    setRowSelection,

    globalFilter,
    setGlobalFilter,
  };
}
