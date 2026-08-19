export interface CursorPageRequest {
  from: string;
  to: string;
  limit: number;
  cursor?: string;
}
