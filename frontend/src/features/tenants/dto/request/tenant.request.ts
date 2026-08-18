export interface CreateTenantRequest {
  name: string;
  slug: string;
  adminEmail: string;
  adminDisplayName: string;
}

export interface UpdateTenantRequest {
  name: string;
  slug: string;
}
