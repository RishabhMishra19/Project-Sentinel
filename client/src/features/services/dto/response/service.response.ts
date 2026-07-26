import type { UserBriefResponse } from "../../../../shared/dto/response";

export interface ServiceResponse {
  id: string;
  productId: string;
  productName: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: UserBriefResponse;
  updatedBy: UserBriefResponse;
  createdAt: string;
  updatedAt: string;
}
