import type { UserBriefResponse } from '../../../../shared/dto/response'

export type TenantStatus = 'ACTIVE' | 'INACTIVE'

export interface TenantResponse {
  id: string
  name: string
  slug: string
  status: TenantStatus
  createdBy: UserBriefResponse
  updatedBy: UserBriefResponse
  createdAt: string
  updatedAt: string
}
