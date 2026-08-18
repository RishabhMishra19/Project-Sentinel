/** Mirrors `com.sentinel.api.common.dto.response.ApiError.FieldError`. */
export interface ApiErrorFieldError {
  field: string;
  message: string;
}

/** Mirrors `com.sentinel.api.common.dto.response.ApiError`. */
export interface ApiError {
  timestamp: string;
  errorCode: string;
  error: string;
  message: string;
  path: string;
  fieldErrors: ApiErrorFieldError[] | null;
}
