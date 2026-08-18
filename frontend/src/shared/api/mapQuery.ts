import type { UseQueryResult } from "@tanstack/react-query";
import type { PageResponse } from "../dto/response/PageResponse";

/** Normalize a paged list query: `rows` from `content`, `isLoading` from `isFetching`. */
export const mapPageQuery = <T>(query: UseQueryResult<PageResponse<T>>) => ({
  ...query,
  rows: query.data?.content ?? [],
  totalElements: query.data?.totalElements ?? 0,
  isLoading: query.isFetching,
});

/** Normalize an array list query: `rows` from `data`, `isLoading` from `isFetching`. */
export const mapListQuery = <T>(query: UseQueryResult<T[]>) => ({
  ...query,
  rows: query.data ?? [],
  isLoading: query.isFetching,
});
