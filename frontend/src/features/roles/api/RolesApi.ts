import { ROLES_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type {
  CreateRoleRequest,
  CreateRoleScopeRequest,
  UpdateRoleRequest,
  UpdateRoleScopeRequest,
} from "../dto/request/role.request";
import type { RoleResponse, RoleScopeResponse } from "../dto/response/role.response";

export class RolesApi {
  static list(): Promise<RoleResponse[]> {
    return apiManager.get<RoleResponse[]>(ROLES_API_ROUTES.LIST);
  }

  static get(id: string): Promise<RoleResponse> {
    return apiManager.get<RoleResponse>(ROLES_API_ROUTES.BY_ID(id));
  }

  static create(payload: CreateRoleRequest): Promise<RoleResponse> {
    return apiManager.post<RoleResponse>(ROLES_API_ROUTES.LIST, payload);
  }

  static update(id: string, payload: UpdateRoleRequest): Promise<RoleResponse> {
    return apiManager.put<RoleResponse>(ROLES_API_ROUTES.BY_ID(id), payload);
  }

  static markInactive(id: string): Promise<void> {
    return apiManager.post<void>(ROLES_API_ROUTES.MARK_INACTIVE(id));
  }

  static listScopes(roleId: string): Promise<RoleScopeResponse[]> {
    return apiManager.get<RoleScopeResponse[]>(ROLES_API_ROUTES.SCOPES(roleId));
  }

  static createScope(roleId: string, payload: CreateRoleScopeRequest): Promise<RoleScopeResponse> {
    return apiManager.post<RoleScopeResponse>(ROLES_API_ROUTES.SCOPES(roleId), payload);
  }

  static updateScope(
    roleId: string,
    scopeId: string,
    payload: UpdateRoleScopeRequest,
  ): Promise<RoleScopeResponse> {
    return apiManager.put<RoleScopeResponse>(
      ROLES_API_ROUTES.SCOPE_BY_ID(roleId, scopeId),
      payload,
    );
  }

  static deactivateScope(roleId: string, scopeId: string): Promise<void> {
    return apiManager.post<void>(ROLES_API_ROUTES.DEACTIVATE_SCOPE(roleId, scopeId));
  }
}
