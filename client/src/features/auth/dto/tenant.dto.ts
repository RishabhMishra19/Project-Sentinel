export type TenantStatus = 'ACTIVE' | 'INACTIVE'

export type TenantSearchBy = 'name' | 'slug'

export interface UserBrief {
  id: string
  name: string
  email: string
}

export interface TenantResponse {
  id: string
  name: string
  slug: string
  status: TenantStatus
  createdBy: UserBrief
  updatedBy: UserBrief
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  slug: string
}

export interface UpdateTenantRequest {
  name: string
  slug: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
}

export interface TenantListParams {
  page?: number
  size?: number
  sort?: string
  status?: TenantStatus
  q?: string
  searchBy?: TenantSearchBy
  createdFrom?: string
  createdTo?: string
}
