import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTenant,
  deleteTenant,
  listTenants,
  updateTenant,
} from '../api/tenantsApi'
import type { CreateTenantRequest, TenantListParams, UpdateTenantRequest } from '../dto/request/tenant.request'

export const tenantsQueryKey = ['tenants'] as const

export function useTenantsQuery(params: TenantListParams | null) {
  return useQuery({
    queryKey: [...tenantsQueryKey, 'list', params],
    queryFn: () => listTenants(params!),
    enabled: params != null,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTenantRequest) => createTenant(payload),
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
    }) => updateTenant(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey })
    },
  })
}
