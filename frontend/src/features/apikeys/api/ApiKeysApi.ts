import { SERVICE_API_KEYS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type { ListQueryRequest } from "../../../shared/dto/request/listQueryRequest";
import type { PageResponse } from "../../../shared/dto/response";
import type { CreateServiceApiKeyRequest } from "../dto/request/apikey.request";
import type {
  ServiceApiKeyCreatedResponse,
  ServiceApiKeyResponse,
} from "../dto/response/apikey.response";

export class ApiKeysApi {
  static list(
    productId: string,
    serviceId: string,
    query: ListQueryRequest,
  ): Promise<PageResponse<ServiceApiKeyResponse>> {
    return apiManager.post<PageResponse<ServiceApiKeyResponse>>(
      SERVICE_API_KEYS_API_ROUTES.SEARCH(productId, serviceId),
      query,
    );
  }

  static create(
    productId: string,
    serviceId: string,
    payload: CreateServiceApiKeyRequest,
  ): Promise<ServiceApiKeyCreatedResponse> {
    return apiManager.post<ServiceApiKeyCreatedResponse>(
      SERVICE_API_KEYS_API_ROUTES.LIST(productId, serviceId),
      payload,
    );
  }

  static revoke(productId: string, serviceId: string, id: string): Promise<void> {
    return apiManager.post<void>(SERVICE_API_KEYS_API_ROUTES.REVOKE(productId, serviceId, id));
  }
}
