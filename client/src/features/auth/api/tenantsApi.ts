import { TENANTS_API_ROUTES } from '../../../shared/api/apiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type {
  CreateTenantRequest,
  PageResponse,
  TenantListParams,
  TenantResponse,
  UpdateTenantRequest,
} from '../dto/tenant.dto'

export function listTenants(
  params: TenantListParams,
): Promise<PageResponse<TenantResponse>> {
  return apiManager.get<PageResponse<TenantResponse>>(TENANTS_API_ROUTES.LIST, {
    params,
  })
}

export function getTenant(id: string): Promise<TenantResponse> {
  return apiManager.get<TenantResponse>(TENANTS_API_ROUTES.BY_ID(id))
}

export function createTenant(
  payload: CreateTenantRequest,
): Promise<TenantResponse> {
  return apiManager.post<TenantResponse>(TENANTS_API_ROUTES.LIST, payload)
}

export function updateTenant(
  id: string,
  payload: UpdateTenantRequest,
): Promise<TenantResponse> {
  return apiManager.put<TenantResponse>(TENANTS_API_ROUTES.BY_ID(id), payload)
}

export function deleteTenant(id: string): Promise<void> {
  return apiManager.delete<void>(TENANTS_API_ROUTES.BY_ID(id))
}
