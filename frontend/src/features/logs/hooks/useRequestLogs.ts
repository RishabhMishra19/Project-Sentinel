import { useQuery } from "@tanstack/react-query";
import { mapPageQuery } from "../../../shared/api/mapQuery";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { RequestLogsApi } from "../api/RequestLogsApi";

export const requestLogsQueryKey = ["logs", "requests"] as const;

export const useRequestLogsQuery = (params: ListQueryRequest) => {
  return mapPageQuery(
    useQuery({
      queryKey: [...requestLogsQueryKey, "list", params],
      queryFn: () => RequestLogsApi.list(params),
    }),
  );
};

export const useRequestLogQuery = (id: string | null) => {
  return useQuery({
    queryKey: [...requestLogsQueryKey, "detail", id],
    queryFn: () => RequestLogsApi.get(id!),
    enabled: id != null,
  });
};
