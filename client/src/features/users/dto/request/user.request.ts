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
