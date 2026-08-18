import type { UserBriefResponse } from "../../../../shared/dto/response";

export interface ProductResponse {
  id: string;
  tenantId: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: UserBriefResponse;
  updatedBy: UserBriefResponse;
  createdAt: string;
  updatedAt: string;
}
