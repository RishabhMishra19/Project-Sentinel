import { SERVICES_API_ROUTES } from '../../../shared/api/ApiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { ServiceListParams, CreateServiceRequest, UpdateServiceRequest } from '../dto/request/service.request'
import type { PageResponse } from '../../../shared/dto/response'
import type { ServiceResponse } from '../dto/response/service.response'

export class ServicesApi {
  static listAll(params: ServiceListParams): Promise<PageResponse<ServiceResponse>> {
    return apiManager.get<PageResponse<ServiceResponse>>(
      SERVICES_API_ROUTES.LIST_ALL,
      { params },
    )
  }

  static list(
    productId: string,
    params: ServiceListParams,
  ): Promise<PageResponse<ServiceResponse>> {
    return apiManager.get<PageResponse<ServiceResponse>>(
      SERVICES_API_ROUTES.LIST(productId),
      { params },
    )
  }

  static get(productId: string, id: string): Promise<ServiceResponse> {
    return apiManager.get<ServiceResponse>(
      SERVICES_API_ROUTES.BY_ID(productId, id),
    )
  }

  static create(
    productId: string,
    payload: CreateServiceRequest,
  ): Promise<ServiceResponse> {
    return apiManager.post<ServiceResponse>(
      SERVICES_API_ROUTES.LIST(productId),
      payload,
    )
  }

  static update(
    productId: string,
    id: string,
    payload: UpdateServiceRequest,
  ): Promise<ServiceResponse> {
    return apiManager.put<ServiceResponse>(
      SERVICES_API_ROUTES.BY_ID(productId, id),
      payload,
    )
  }

  static delete(productId: string, id: string): Promise<void> {
    return apiManager.delete<void>(SERVICES_API_ROUTES.BY_ID(productId, id))
  }
}
