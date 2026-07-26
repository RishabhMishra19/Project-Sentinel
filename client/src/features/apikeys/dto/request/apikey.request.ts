import type { ServiceApiKeyStatus } from "../response/apikey.response";

export type ServiceApiKeySearchBy = "name";

export interface ServiceApiKeyListParams {
  page: number;
  size: number;
  sort?: string;
  status?: ServiceApiKeyStatus;
  q?: string;
  searchBy?: ServiceApiKeySearchBy;
}

export interface CreateServiceApiKeyRequest {
  name: string;
}
