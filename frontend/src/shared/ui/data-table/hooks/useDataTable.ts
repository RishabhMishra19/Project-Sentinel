import { useCallback, useMemo, type ReactNode } from "react";
import type { ListQueryRequest } from "../../../dto/request/listQueryRequest";
import { applyQueryOnData, toListQueryRequest } from "../../../utils/queryUtils";
import type { DataTableColumn, DataTableProps, RowAction } from "../types";
import type { DataTableQueryState } from "../utils/queryState";
import { useDataTableQueryState } from "./useDataTableQueryState";

type UseDataTableOptions<T extends object> = {
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  initialState?: Partial<DataTableQueryState>;
  enablePagination?: boolean;
  rowActions?: RowAction<T>[];
  toolbarActions?: ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
};

type LocalPage<T extends object> = {
  rows: T[];
  totalElements: number;
};

type BindPageInput<T extends object> = {
  rows: T[];
  totalElements?: number;
  serverCursorProps?: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isLoading?: boolean;
  isError?: boolean;
};

type UseDataTableResult<T extends object> = {
  query: DataTableQueryState;
  listQueryRequest: ListQueryRequest;
  /** Client: filter → sort → paginate in-memory rows for bindPage. */
  toLocalPage: (rows: T[]) => LocalPage<T>;
  /** Merge a page (server or toLocalPage) into DataTable props. */
  bindPage: (page: BindPageInput<T>) => DataTableProps<T>;
};

/**
 * Owns data-table query state.
 * - Server: fetch with `listQueryRequest`, then `bindPage(page)`.
 * - Client: `bindPage(toLocalPage(rows))`.
 */
export const useDataTable = <T extends object>({
  columns,
  getRowId,
  initialState,
  enablePagination = true,
  rowActions,
  toolbarActions,
  emptyMessage = "No data found!",
  errorMessage = "Could not load data!",
  isLoading,
  isError,
}: UseDataTableOptions<T>): UseDataTableResult<T> => {
  const { query, queryProps } = useDataTableQueryState({
    columns,
    initialState,
    enablePagination,
  });

  const listQueryRequest = useMemo(() => toListQueryRequest(query), [query]);

  const toLocalPage = useCallback(
    (rows: T[]): LocalPage<T> => applyQueryOnData(rows, columns, query, { enablePagination }),
    [columns, query, enablePagination],
  );

  const bindPage = useCallback(
    (page: BindPageInput<T>): DataTableProps<T> => ({
      columns,
      getRowId,
      ...queryProps,
      rows: page.rows,
      isLoading: page.isLoading ?? isLoading,
      emptyMessage: (page.isError ?? isError) ? (errorMessage ?? emptyMessage) : emptyMessage,
      rowActions,
      toolbarActions,
      pagination: queryProps.pagination
        ? { ...queryProps.pagination, totalElements: page.totalElements! }
        : undefined,
      cursorPagination:
        queryProps.cursorPagination && page.serverCursorProps
          ? {
              ...queryProps.cursorPagination,
              startCursor: page.serverCursorProps.startCursor,
              endCursor: page.serverCursorProps.endCursor,
              hasNextPage: page.serverCursorProps.hasNextPage,
              hasPreviousPage: page.serverCursorProps.hasPreviousPage,
            }
          : undefined,
    }),
    [
      columns,
      getRowId,
      queryProps,
      emptyMessage,
      errorMessage,
      isLoading,
      isError,
      rowActions,
      toolbarActions,
    ],
  );

  return { query, listQueryRequest, toLocalPage, bindPage };
};
