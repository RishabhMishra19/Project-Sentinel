import type { CursorPageRequest } from "../../../../shared/dto/request/CursorPageRequest";

export interface ListRequestLogRequest extends CursorPageRequest {
  endpointId?: string;
  search?: string;
  requestId?: string;
}
