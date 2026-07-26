export interface RoleBriefResponse {
  id: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  status: "ACTIVE" | "INACTIVE";
  tenantAdmin: boolean;
  roles: RoleBriefResponse[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CreateUserResponse extends UserResponse {
  temporaryPassword: string;
}
