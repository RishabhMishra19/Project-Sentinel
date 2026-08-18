/** Mirrors `com.sentinel.api.common.response.PageResponse`. */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}
