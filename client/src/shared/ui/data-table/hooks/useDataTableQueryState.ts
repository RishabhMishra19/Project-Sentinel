import { useCallback, useMemo, useState, type ReactNode } from "react";
import type {
  DataTableColumn,
  DataTableProps,
  DataTableSearchState,
  DataTableSort,
  RowAction,
} from "../types";
import { createInitialQueryState, type DataTableQueryState } from "../utils/queryState";
import type { FiltersChange } from "../../filters";

type UseDataTableQueryStateOptions<T extends object> = {
  columns: DataTableColumn<T>[];
  initialState?: Partial<DataTableQueryState>;
  enablePagination?: boolean;
};

/** Query-owned slice of DataTable props (values + change handlers). */
export type DataTableQueryProps<T extends object> = Pick<
  DataTableProps<T>,
  "sortingConfig" | "searchConfig" | "filtersConfig" | "pagination"
>;

export const useDataTableQueryState = <T extends object>({
  columns,
  initialState,
  enablePagination = true,
}: UseDataTableQueryStateOptions<T>) => {
  const [query, setQuery] = useState<DataTableQueryState>(() =>
    createInitialQueryState(columns, initialState),
  );

  const setSorting = useCallback((sorting: DataTableSort) => {
    setQuery((prev) => ({ ...prev, sorting, pageIndex: 0 }));
  }, []);

  const setSearch = useCallback((search: DataTableSearchState) => {
    setQuery((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, []);

  const setFilters = useCallback((next: FiltersChange) => {
    setQuery((prev) => ({
      ...prev,
      filters: next.filters,
      apiFilters: next.apiFilters,
      pageIndex: 0,
    }));
  }, []);

  const setPageIndex = useCallback((pageIndex: number) => {
    setQuery((prev) => ({ ...prev, pageIndex }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
  }, []);

  const queryProps = useMemo((): DataTableQueryProps<T> => {
    const props: DataTableQueryProps<T> = {
      sortingConfig: {
        sorting: query.sorting,
        onSortingChange: setSorting,
      },
      searchConfig: {
        search: query.search,
        onSearchChange: setSearch,
      },
      filtersConfig: {
        filters: query.filters,
        onFiltersChange: setFilters,
      },
    };

    if (enablePagination) {
      props.pagination = {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize,
        totalElements: 0,
        onPageIndexChange: setPageIndex,
        onPageSizeChange: setPageSize,
      };
    }

    return props;
  }, [query, enablePagination, setSorting, setSearch, setFilters, setPageIndex, setPageSize]);

  return {
    query,
    queryProps,
    setQuery,
    setSorting,
    setSearch,
    setFilters,
    setPageIndex,
    setPageSize,
  };
};

type BuildTablePropsInput<T extends object> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  query: DataTableQueryState;
  totalElements?: number;
  enablePagination?: boolean;
  rowActions?: RowAction<T>[];
  toolbarActions?: ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  onSortingChange: (next: DataTableSort) => void;
  onSearchChange: (next: DataTableSearchState) => void;
  onFiltersChange: (next: FiltersChange) => void;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const buildDataTableProps = <T extends object>({
  columns,
  rows,
  getRowId,
  query,
  totalElements = 0,
  enablePagination = true,
  rowActions,
  toolbarActions,
  isLoading,
  emptyMessage,
  onSortingChange,
  onSearchChange,
  onFiltersChange,
  onPageIndexChange,
  onPageSizeChange,
}: BuildTablePropsInput<T>): DataTableProps<T> => {
  const props: DataTableProps<T> = {
    columns,
    rows,
    getRowId,
    sortingConfig: {
      sorting: query.sorting,
      onSortingChange,
    },
    searchConfig: {
      search: query.search,
      onSearchChange,
    },
    filtersConfig: {
      filters: query.filters,
      onFiltersChange,
    },
    rowActions,
    toolbarActions,
    isLoading,
    emptyMessage,
  };

  if (enablePagination) {
    props.pagination = {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      totalElements,
      onPageIndexChange,
      onPageSizeChange,
    };
  }

  return props;
};

export const toTanStackSorting = (sorting: DataTableSort) =>
  sorting ? [{ id: sorting.id, desc: sorting.desc }] : [];

export const fromTanStackSorting = (sorting: { id: string; desc: boolean }[]): DataTableSort => {
  const first = sorting[0];
  if (!first) {
    return null;
  }
  return { id: first.id, desc: first.desc };
};
