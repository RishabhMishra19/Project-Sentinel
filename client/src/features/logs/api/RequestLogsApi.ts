import { LOGS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import type { PageResponse } from "../../../shared/dto/response/PageResponse";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

export class RequestLogsApi {
  static list(query: ListQueryRequest): Promise<PageResponse<RequestLogResponse>> {
    return apiManager.post<PageResponse<RequestLogResponse>>(LOGS_API_ROUTES.SEARCH, query);
  }

  static get(id: string): Promise<RequestLogResponse> {
    return apiManager.get<RequestLogResponse>(LOGS_API_ROUTES.BY_ID(id));
  }
}
