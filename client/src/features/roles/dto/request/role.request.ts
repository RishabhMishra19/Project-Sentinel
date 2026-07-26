export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name: string;
}

export type RoleScopeType = "PRODUCT" | "SERVICE";
export type PermissionType = "ALL" | "READ" | "READ_AND_WRITE";

export interface CreateRoleScopeRequest {
  scopeType: RoleScopeType;
  scopeId: string;
  permission: PermissionType;
}

export interface UpdateRoleScopeRequest {
  permission: PermissionType;
}
