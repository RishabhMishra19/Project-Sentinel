export interface CursorPageResponse<T> {
  content: T[];
  size: number;
  hasNext: boolean;
  nextCursor: String;
}
