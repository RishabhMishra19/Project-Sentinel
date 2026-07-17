export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
  timestamp: Date;
}

export interface ApiErrorResponse {
  errorCode: string;
  message: string;
  errors?: { field: string; message: string }[];
  timestamp: Date;
  traceId: string;
}

interface PageResult<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
}

export type ApiPageResponse<T> = ApiSuccessResponse<PageResult<T>>;
