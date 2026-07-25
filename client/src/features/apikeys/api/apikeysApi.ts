import { SERVICE_API_KEYS_API_ROUTES } from '../../../shared/api/apiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { PageResponse } from '../../../shared/dto/response'
import type {
  CreateServiceApiKeyRequest,
  ServiceApiKeyListParams,
} from '../dto/request/apikey.request'
import type {
  ServiceApiKeyCreatedResponse,
  ServiceApiKeyResponse,
} from '../dto/response/apikey.response'

export function listServiceApiKeys(
  productId: string,
  serviceId: string,
  params: ServiceApiKeyListParams,
): Promise<PageResponse<ServiceApiKeyResponse>> {
  return apiManager.get<PageResponse<ServiceApiKeyResponse>>(
    SERVICE_API_KEYS_API_ROUTES.LIST(productId, serviceId),
    { params },
  )
}

export function createServiceApiKey(
  productId: string,
  serviceId: string,
  payload: CreateServiceApiKeyRequest,
): Promise<ServiceApiKeyCreatedResponse> {
  return apiManager.post<ServiceApiKeyCreatedResponse>(
    SERVICE_API_KEYS_API_ROUTES.LIST(productId, serviceId),
    payload,
  )
}

export function revokeServiceApiKey(
  productId: string,
  serviceId: string,
  id: string,
): Promise<void> {
  return apiManager.post<void>(
    SERVICE_API_KEYS_API_ROUTES.REVOKE(productId, serviceId, id),
  )
}
