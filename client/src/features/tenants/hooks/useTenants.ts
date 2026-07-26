import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { TenantsApi } from "../api/TenantsApi";
import type { CreateTenantRequest, UpdateTenantRequest } from "../dto/request/tenant.request";

export const tenantsQueryKey = ["tenants"] as const;

export function useTenantsQuery(params: ListQueryRequest | null) {
  return useQuery({
    queryKey: [...tenantsQueryKey, "list", params],
    queryFn: () => TenantsApi.list(params!),
    enabled: params != null,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantRequest) => TenantsApi.create(payload),
    meta: {
      toast: {
        loading: "Creating tenant…",
        success: "Tenant created successfully.",
        error: (error) => getApiErrorMessage(error, "Could not create tenant. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTenantRequest }) =>
      TenantsApi.update(id, payload),
    meta: {
      toast: {
        loading: "Updating tenant…",
        success: "Tenant updated successfully.",
        error: (error) => getApiErrorMessage(error, "Could not update tenant. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TenantsApi.delete(id),
    meta: {
      toast: {
        loading: "Deactivating tenant…",
        success: "Tenant deactivated.",
        error: (error) =>
          getApiErrorMessage(error, "Could not deactivate tenant. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
}
