import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { useRolesQuery } from "../../roles/hooks/useRoles";
import { UsersApi } from "../api/UsersApi";
import type {
  AssignRoleRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "../dto/request/user.request";

export { useRolesQuery };
export const usersQueryKey = ["users"] as const;

export function useUsersQuery(params: ListQueryRequest | null) {
  return useQuery({
    queryKey: [...usersQueryKey, "list", params],
    queryFn: () => UsersApi.list(params!),
    enabled: params != null,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => UsersApi.create(payload),
    meta: {
      toast: {
        loading: "Creating user…",
        success: "User created successfully.",
        error: (error) => getApiErrorMessage(error, "Could not create user. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      UsersApi.update(id, payload),
    meta: {
      toast: {
        loading: "Updating user…",
        success: "User updated successfully.",
        error: (error) => getApiErrorMessage(error, "Could not update user. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignRoleRequest }) =>
      UsersApi.assignRole(id, payload),
    meta: {
      toast: {
        loading: "Assigning role…",
        success: "Role assigned successfully.",
        error: (error) => getApiErrorMessage(error, "Could not assign role. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

export function useMarkUserInactive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersApi.markInactive(id),
    meta: {
      toast: {
        loading: "Marking user inactive…",
        success: "User marked inactive.",
        error: (error) =>
          getApiErrorMessage(error, "Could not mark user inactive. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}
