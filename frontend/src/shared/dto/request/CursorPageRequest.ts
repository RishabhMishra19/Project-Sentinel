export interface CursorPageRequest {
  pageSize: number;
  cursor?: string;
  direction: "FORWARD" | "BACKWARD";
}
