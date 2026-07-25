import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TenantsApi } from '../api/TenantsApi'
import type { CreateTenantRequest, TenantListParams, UpdateTenantRequest } from '../dto/request/tenant.request'

export const tenantsQueryKey = ['tenants'] as const

export function useTenantsQuery(params: TenantListParams | null) {
  return useQuery({
    queryKey: [...tenantsQueryKey, 'list', params],
    queryFn: () => TenantsApi.list(params!),
    enabled: params != null,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTenantRequest) => TenantsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateTenantRequest
    }) => TenantsApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => TenantsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey })
    },
  })
}
