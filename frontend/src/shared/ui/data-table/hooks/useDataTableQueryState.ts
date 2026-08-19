import { useCallback, useMemo, useState } from "react";
import type {
  DataTableColumn,
  DataTableProps,
  DataTableSearchState,
  DataTableSort,
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
  "sortingConfig" | "searchConfig" | "filtersConfig" | "pagination" | "cursorPagination"
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
    setQuery((prev) => ({
      ...prev,
      pageSize,
      pageIndex: 0,
      cursor: undefined,
      cursorType: "FORWARD",
    }));
  }, []);

  const onNextPage = useCallback((afterCursor: string) => {
    setQuery((prev) => ({ ...prev, cursor: afterCursor, cursorType: "FORWARD" }));
  }, []);

  const onPrevPage = useCallback((beforeCursor: string) => {
    setQuery((prev) => ({ ...prev, cursor: beforeCursor, cursorType: "BACKWARD" }));
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
      props.cursorPagination = {
        pageSize: query.pageSize,
        startCursor: undefined,
        endCursor: undefined,
        hasNextPage: false,
        hasPreviousPage: false,
        onNextPage,
        onPrevPage,
        onPageSizeChange: setPageSize,
      };
    }

    return props;
  }, [query, enablePagination, setSorting, setSearch, setFilters, setPageIndex, setPageSize]);

  return { query, queryProps };
};
