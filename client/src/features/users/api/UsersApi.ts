import {
  USERS_API_ROUTES,
} from '../../../shared/api/ApiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type {
  AssignRoleRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
} from '../dto/request/user.request'
import type { PageResponse } from '../../../shared/dto/response'
import type {
  CreateUserResponse,
  UserResponse,
} from '../dto/response/user.response'

export class UsersApi {
  static list(params: UserListParams): Promise<PageResponse<UserResponse>> {
    return apiManager.get<PageResponse<UserResponse>>(USERS_API_ROUTES.LIST, {
      params,
    })
  }

  static get(id: string): Promise<UserResponse> {
    return apiManager.get<UserResponse>(USERS_API_ROUTES.BY_ID(id))
  }

  static create(payload: CreateUserRequest): Promise<CreateUserResponse> {
    return apiManager.post<CreateUserResponse>(USERS_API_ROUTES.LIST, payload)
  }

  static update(
    id: string,
    payload: UpdateUserRequest,
  ): Promise<UserResponse> {
    return apiManager.put<UserResponse>(USERS_API_ROUTES.BY_ID(id), payload)
  }

  static assignRole(
    id: string,
    payload: AssignRoleRequest,
  ): Promise<UserResponse> {
    return apiManager.post<UserResponse>(
      USERS_API_ROUTES.ASSIGN_ROLE(id),
      payload,
    )
  }

  static markInactive(id: string): Promise<void> {
    return apiManager.post<void>(USERS_API_ROUTES.MARK_INACTIVE(id))
  }
}
