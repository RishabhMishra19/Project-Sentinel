import type { UserBriefResponse } from '../../../../shared/dto/response'

export type RoleStatus = 'ACTIVE' | 'INACTIVE'

export interface RoleResponse {
  id: string
  name: string
  status: RoleStatus
  createdBy: UserBriefResponse
  updatedBy: UserBriefResponse
  createdAt: string
  updatedAt: string
}

export type RoleScopeType = 'PRODUCT' | 'SERVICE'
export type PermissionType = 'ALL' | 'READ' | 'READ_AND_WRITE'
export type RoleScopeStatus = 'ACTIVE' | 'INACTIVE'

export interface RoleScopeResponse {
  id: string
  scopeType: RoleScopeType
  scopeId: string
  scopeName: string
  permission: PermissionType
  status: RoleScopeStatus
}
