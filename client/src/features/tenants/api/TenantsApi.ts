import { TENANTS_API_ROUTES } from '../../../shared/api/ApiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type {
  CreateTenantRequest,
  TenantListParams,
  UpdateTenantRequest,
} from '../dto/request/tenant.request'
import type { PageResponse } from '../../../shared/dto/response'
import type {
  CreateTenantResponse,
  TenantResponse,
} from '../dto/response/tenant.response'

export class TenantsApi {
  static list(params: TenantListParams): Promise<PageResponse<TenantResponse>> {
    return apiManager.get<PageResponse<TenantResponse>>(TENANTS_API_ROUTES.LIST, {
      params,
    })
  }

  static get(id: string): Promise<TenantResponse> {
    return apiManager.get<TenantResponse>(TENANTS_API_ROUTES.BY_ID(id))
  }

  static create(payload: CreateTenantRequest): Promise<CreateTenantResponse> {
    return apiManager.post<CreateTenantResponse>(TENANTS_API_ROUTES.LIST, payload)
  }

  static update(
    id: string,
    payload: UpdateTenantRequest,
  ): Promise<TenantResponse> {
    return apiManager.put<TenantResponse>(TENANTS_API_ROUTES.BY_ID(id), payload)
  }

  static delete(id: string): Promise<void> {
    return apiManager.delete<void>(TENANTS_API_ROUTES.BY_ID(id))
  }
}
