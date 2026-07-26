import type { UserBriefResponse } from "../../../../shared/dto/response";

export type ServiceApiKeyStatus = "ACTIVE" | "REVOKED";

export interface ServiceApiKeyResponse {
  id: string;
  serviceId: string;
  name: string;
  status: ServiceApiKeyStatus;
  createdBy: UserBriefResponse;
  updatedBy: UserBriefResponse;
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
}

export interface ServiceApiKeyCreatedResponse extends ServiceApiKeyResponse {
  apiKey: string;
}
