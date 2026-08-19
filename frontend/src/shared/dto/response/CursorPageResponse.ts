export interface CursorPageResponse<T> {
  content: T[];
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
