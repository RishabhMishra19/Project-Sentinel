import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapPageQuery } from "../../../shared/api/mapQuery";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { ApiKeysApi } from "../api/ApiKeysApi";
import type { CreateServiceApiKeyRequest } from "../dto/request/apikey.request";

export const apiKeysQueryKey = (productId: string, serviceId: string) =>
  ["api-keys", productId, serviceId] as const;

export const useServiceApiKeysQuery = (
  productId: string | undefined,
  serviceId: string | undefined,
  params: ListQueryRequest,
) => {
  return mapPageQuery(
    useQuery({
      queryKey: [...apiKeysQueryKey(productId ?? "", serviceId ?? ""), "list", params],
      queryFn: () => ApiKeysApi.list(productId!, serviceId!, params),
      enabled: productId != null && serviceId != null,
    }),
  );
};

export const useCreateServiceApiKey = (productId: string, serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceApiKeyRequest) =>
      ApiKeysApi.create(productId, serviceId, payload),
    meta: {
      toast: {
        loading: "Creating API key…",
        success: "API key created. Copy it now — it will not be shown again.",
        error: (error) => getApiErrorMessage(error, "Could not create API key. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey(productId, serviceId),
      });
    },
  });
};

export const useRevokeServiceApiKey = (productId: string, serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiKeysApi.revoke(productId, serviceId, id),
    meta: {
      toast: {
        loading: "Revoking API key…",
        success: "API key revoked.",
        error: (error) => getApiErrorMessage(error, "Could not revoke API key. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey(productId, serviceId),
      });
    },
  });
};
