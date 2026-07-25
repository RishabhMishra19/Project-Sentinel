import type { TenantStatus } from "../response/tenant.response";

export type TenantSearchBy = "name" | "slug";

export interface CreateTenantRequest {
  name: string;
  slug: string;
}

export interface UpdateTenantRequest {
  name: string;
  slug: string;
}

export interface TenantListParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: TenantStatus;
  q?: string;
  searchBy?: TenantSearchBy;
  createdFrom?: string;
  createdTo?: string;
}
