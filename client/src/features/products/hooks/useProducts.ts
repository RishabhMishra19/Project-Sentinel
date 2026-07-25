import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '../api/productsApi'
import type { ProductListParams, CreateProductRequest, UpdateProductRequest } from '../dto/request/product.request'

export const productsQueryKey = ['products'] as const

export function useProductsQuery(params: ProductListParams | null) {
  return useQuery({
    queryKey: [...productsQueryKey, 'list', params],
    queryFn: () => listProducts(params!),
    enabled: params != null,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductRequest) => createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProductRequest
    }) => updateProduct(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}
