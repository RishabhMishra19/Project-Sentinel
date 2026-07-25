export type ServiceStatus = 'ACTIVE' | 'INACTIVE'

export type ServiceSearchBy = 'name'

export interface CreateServiceRequest {
  name: string
}

export interface UpdateServiceRequest {
  name: string
}

export interface ServiceListParams {
  page?: number
  size?: number
  sort?: string
  status?: ServiceStatus
  q?: string
  searchBy?: ServiceSearchBy
  createdFrom?: string
  createdTo?: string
}
