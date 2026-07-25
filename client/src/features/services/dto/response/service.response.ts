import type { UserBriefResponse } from '../../../../shared/dto/response'

export type ServiceStatus = 'ACTIVE' | 'INACTIVE'

export interface ServiceResponse {
  id: string
  productId: string
  productName: string
  name: string
  status: ServiceStatus
  createdBy: UserBriefResponse
  updatedBy: UserBriefResponse
  createdAt: string
  updatedAt: string
}
