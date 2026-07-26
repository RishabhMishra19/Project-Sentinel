import { LOGS_API_ROUTES } from '../../../shared/api/api.routes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { PageResponse } from '../../../shared/dto/response/PageResponse'
import type { RequestLogListParams } from '../dto/request/requestLog.request'
import type { RequestLogResponse } from '../dto/response/requestLog.response'

export class RequestLogsApi {
  static list(
    params: RequestLogListParams,
  ): Promise<PageResponse<RequestLogResponse>> {
    return apiManager.get<PageResponse<RequestLogResponse>>(LOGS_API_ROUTES.LIST, {
      params,
    })
  }

  static get(id: string): Promise<RequestLogResponse> {
    return apiManager.get<RequestLogResponse>(LOGS_API_ROUTES.BY_ID(id))
  }
}
