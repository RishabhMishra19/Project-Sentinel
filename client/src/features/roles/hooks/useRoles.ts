import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApiErrorMessage } from '../../../shared/forms/getApiErrorMessage'
import { RolesApi } from '../api/RolesApi'
import type {
  CreateRoleRequest,
  CreateRoleScopeRequest,
  UpdateRoleRequest,
  UpdateRoleScopeRequest,
} from '../dto/request/role.request'

export const rolesQueryKey = ['roles'] as const

export function useRolesQuery(enabled = true) {
  return useQuery({
    queryKey: rolesQueryKey,
    queryFn: () => RolesApi.list(),
    enabled,
  })
}

export function useRoleQuery(roleId: string | null, enabled = true) {
  return useQuery({
    queryKey: [...rolesQueryKey, roleId],
    queryFn: () => RolesApi.get(roleId!),
    enabled: enabled && roleId != null,
  })
}

export function useRoleScopesQuery(roleId: string | null, enabled = true) {
  return useQuery({
    queryKey: [...rolesQueryKey, roleId, 'scopes'],
    queryFn: () => RolesApi.listScopes(roleId!),
    enabled: enabled && roleId != null,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => RolesApi.create(payload),
    meta: {
      toast: {
        loading: 'Creating role…',
        success: 'Role created successfully.',
        error: (error) =>
          getApiErrorMessage(error, 'Could not create role. Please try again.'),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rolesQueryKey })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateRoleRequest
    }) => RolesApi.update(id, payload),
    meta: {
      toast: {
        loading: 'Updating role…',
        success: 'Role updated successfully.',
        error: (error) =>
          getApiErrorMessage(
            error,
            'Could not update role. Please try again.',
          ),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rolesQueryKey })
    },
  })
}

export function useMarkRoleInactive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => RolesApi.markInactive(id),
    meta: {
      toast: {
        loading: 'Deactivating role…',
        success: 'Role deactivated.',
        error: (error) =>
          getApiErrorMessage(
            error,
            'Could not deactivate role. Please try again.',
          ),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rolesQueryKey })
    },
  })
}

export function useCreateRoleScope(roleId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRoleScopeRequest) =>
      RolesApi.createScope(roleId!, payload),
    meta: {
      toast: {
        loading: 'Creating scope…',
        success: 'Scope created successfully.',
        error: (error) =>
          getApiErrorMessage(
            error,
            'Could not create scope. Please try again.',
          ),
      },
    },
    onSuccess: () => {
      if (roleId != null) {
        void queryClient.invalidateQueries({
          queryKey: [...rolesQueryKey, roleId, 'scopes'],
        })
      }
    },
  })
}

export function useUpdateRoleScope(roleId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      scopeId,
      payload,
    }: {
      scopeId: string
      payload: UpdateRoleScopeRequest
    }) => RolesApi.updateScope(roleId!, scopeId, payload),
    meta: {
      toast: {
        loading: 'Updating scope…',
        success: 'Scope updated successfully.',
        error: (error) =>
          getApiErrorMessage(
            error,
            'Could not update scope. Please try again.',
          ),
      },
    },
    onSuccess: () => {
      if (roleId != null) {
        void queryClient.invalidateQueries({
          queryKey: [...rolesQueryKey, roleId, 'scopes'],
        })
      }
    },
  })
}

export function useDeactivateRoleScope(roleId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scopeId: string) =>
      RolesApi.deactivateScope(roleId!, scopeId),
    meta: {
      toast: {
        loading: 'Deactivating scope…',
        success: 'Scope deactivated.',
        error: (error) =>
          getApiErrorMessage(
            error,
            'Could not deactivate scope. Please try again.',
          ),
      },
    },
    onSuccess: () => {
      if (roleId != null) {
        void queryClient.invalidateQueries({
          queryKey: [...rolesQueryKey, roleId, 'scopes'],
        })
      }
    },
  })
}
