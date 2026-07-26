export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserSearchBy = "email" | "displayName";

export interface CreateUserRequest {
  email: string;
  displayName: string;
}

export interface UpdateUserRequest {
  displayName: string;
}

export interface AssignRoleRequest {
  roleId: string;
}

export interface UserListParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: UserStatus;
  q?: string;
  searchBy?: UserSearchBy;
  from?: string;
  to?: string;
}
