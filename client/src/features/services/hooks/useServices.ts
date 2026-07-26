import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { ServicesApi } from "../api/services.api";
import type { CreateServiceRequest, UpdateServiceRequest } from "../dto/request/service.request";

export const servicesQueryKey = (productId?: string) =>
  productId ? (["services", productId] as const) : (["services"] as const);

export const useAllServicesQuery = (params: ListQueryRequest | null) => {
  return useQuery({
    queryKey: [...servicesQueryKey(), "list", params],
    queryFn: () => ServicesApi.listAll(params!),
    enabled: params != null,
  });
};

export const useServicesQuery = (
  productId: string | undefined,
  params: ListQueryRequest | null,
) => {
  return useQuery({
    queryKey: [...servicesQueryKey(productId), "list", params],
    queryFn: () => ServicesApi.list(productId!, params!),
    enabled: productId != null && params != null,
  });
};

export const useServiceEndpointsQuery = (serviceId: string | undefined) => {
  return useQuery({
    queryKey: [...servicesQueryKey(), "endpoints", serviceId],
    queryFn: () => ServicesApi.listEndpoints(serviceId!),
    enabled: serviceId != null,
  });
};

export const useCreateService = (productId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId: targetProductId,
      payload,
    }: {
      productId: string;
      payload: CreateServiceRequest;
    }) => ServicesApi.create(targetProductId, payload),
    meta: {
      toast: {
        loading: "Creating service…",
        success: "Service created successfully.",
        error: (error) => getApiErrorMessage(error, "Could not create service. Please try again."),
      },
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({
        queryKey: servicesQueryKey(variables.productId),
      });
      if (productId) {
        void queryClient.invalidateQueries({
          queryKey: servicesQueryKey(productId),
        });
      }
    },
  });
};

export const useUpdateService = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServiceRequest }) =>
      ServicesApi.update(productId, id, payload),
    meta: {
      toast: {
        loading: "Updating service…",
        success: "Service updated successfully.",
        error: (error) => getApiErrorMessage(error, "Could not update service. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({
        queryKey: servicesQueryKey(productId),
      });
    },
  });
};

export const useDeleteService = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ServicesApi.delete(productId, id),
    meta: {
      toast: {
        loading: "Deactivating service…",
        success: "Service deactivated.",
        error: (error) =>
          getApiErrorMessage(error, "Could not deactivate service. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.invalidateQueries({
        queryKey: servicesQueryKey(productId),
      });
    },
  });
};
