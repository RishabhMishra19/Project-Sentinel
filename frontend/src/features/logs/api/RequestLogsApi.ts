import { LOGS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type { CursorPageResponse } from "../../../shared/dto/response/CursorPageResponse";
import type { ListRequestLogRequest } from "../dto/request/ListRequestLog.request";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

export class RequestLogsApi {
  static list(
    serviceId: string,
    request: ListRequestLogRequest,
  ): Promise<CursorPageResponse<RequestLogResponse>> {
    return apiManager.post<CursorPageResponse<RequestLogResponse>>(
      LOGS_API_ROUTES.LIST(serviceId),
      request,
    );
  }

  static get(serviceId: string, id: string): Promise<RequestLogResponse> {
    return apiManager.get<RequestLogResponse>(LOGS_API_ROUTES.BY_ID(serviceId, id));
  }
}
