import type { UserBriefResponse } from '../../../../shared/dto/response'

export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface ProductResponse {
  id: string
  tenantId: string
  name: string
  status: ProductStatus
  createdBy: UserBriefResponse
  updatedBy: UserBriefResponse
  createdAt: string
  updatedAt: string
}
