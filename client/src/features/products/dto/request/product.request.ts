export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export type ProductSearchBy = 'name'

export interface CreateProductRequest {
  name: string
}

export interface UpdateProductRequest {
  name: string
}

export interface ProductListParams {
  page?: number
  size?: number
  sort?: string
  status?: ProductStatus
  q?: string
  searchBy?: ProductSearchBy
  createdFrom?: string
  createdTo?: string
}
