import type { UseQueryResult } from "@tanstack/react-query";
import type { PageResponse } from "../dto/response/PageResponse";
import type { CursorPageResponse } from "../dto/response/CursorPageResponse";

/** Normalize a paged list query: `rows` from `content`, `isLoading` from `isFetching`. */
export const mapPageQuery = <T>(query: UseQueryResult<PageResponse<T>>) => ({
  ...query,
  rows: query.data?.content ?? [],
  totalElements: query.data?.totalElements ?? 0,
  isLoading: query.isFetching,
});

/** Normalize a paged list query: `rows` from `content`, `isLoading` from `isFetching`. */
export const mapCursorPageQuery = <T>(query: UseQueryResult<CursorPageResponse<T>>) => ({
  ...query,
  rows: query.data?.content ?? [],
  isLoading: query.isFetching,
  serverCursorProps: !!query.data
    ? {
        startCursor: query.data.startCursor,
        endCursor: query.data.endCursor,
        hasNextPage: query.data.hasNextPage,
        hasPreviousPage: query.data.hasPreviousPage,
      }
    : undefined,
});

/** Normalize an array list query: `rows` from `data`, `isLoading` from `isFetching`. */
export const mapListQuery = <T>(query: UseQueryResult<T[]>) => ({
  ...query,
  rows: query.data ?? [],
  isLoading: query.isFetching,
});
