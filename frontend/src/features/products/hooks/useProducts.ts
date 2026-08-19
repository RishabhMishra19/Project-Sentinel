import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapPageQuery } from "../../../shared/api/mapQuery";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import { ProductsApi } from "../api/ProductsApi";
import type { ListQueryRequest } from "../../../shared/dto/request/listQueryRequest";
import type { CreateProductRequest, UpdateProductRequest } from "../dto/request/product.request";

const productsQueryKey = ["products"];

export const useProductsQuery = (params: ListQueryRequest | null) => {
  return mapPageQuery(
    useQuery({
      queryKey: [...productsQueryKey, "list", params],
      queryFn: () => ProductsApi.list(params!),
      enabled: params != null,
    }),
  );
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) => ProductsApi.create(payload),
    meta: {
      toast: {
        loading: "Creating product…",
        success: "Product created successfully.",
        error: (error) => getApiErrorMessage(error, "Could not create product. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductRequest }) =>
      ProductsApi.update(id, payload),
    meta: {
      toast: {
        loading: "Updating product…",
        success: "Product updated successfully.",
        error: (error) => getApiErrorMessage(error, "Could not update product. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductsApi.delete(id),
    meta: {
      toast: {
        loading: "Deactivating product…",
        success: "Product deactivated.",
        error: (error) =>
          getApiErrorMessage(error, "Could not deactivate product. Please try again."),
      },
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
};
