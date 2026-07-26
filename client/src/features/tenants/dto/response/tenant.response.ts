import type { UserBriefResponse } from "../../../../shared/dto/response";

export type TenantStatus = "ACTIVE" | "INACTIVE";

export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  adminEmails: string[];
  createdBy: UserBriefResponse;
  updatedBy: UserBriefResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantResponse extends TenantResponse {
  admin: {
    id: string;
    email: string;
    displayName: string;
    tenantAdmin: boolean;
  };
  temporaryPassword: string;
}
