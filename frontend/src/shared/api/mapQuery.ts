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
  size: query.data?.size ?? 0,
  hasNext: query.data?.hasNext ?? false,
  nextCursor: query.data?.nextCursor,
  isLoading: query.isFetching,
});

/** Normalize an array list query: `rows` from `data`, `isLoading` from `isFetching`. */
export const mapListQuery = <T>(query: UseQueryResult<T[]>) => ({
  ...query,
  rows: query.data ?? [],
  isLoading: query.isFetching,
});
