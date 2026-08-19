import { useQuery } from "@tanstack/react-query";
import { mapCursorPageQuery } from "../../../shared/api/mapQuery";
import { RequestLogsApi } from "../api/RequestLogsApi";
import type { CursorPageRequest } from "../../../shared/dto/request/CursorPageRequest";

export const requestLogsQueryKey = ["logs", "requests"] as const;

export const useRequestLogsQuery = (serviceId: string | null, params?: CursorPageRequest) => {
  return mapCursorPageQuery(
    useQuery({
      queryKey: [...requestLogsQueryKey, "list", params],
      queryFn: () => RequestLogsApi.list(serviceId!, params!),
      enabled: params !== undefined && serviceId !== null,
    }),
  );
};

export const useRequestLogQuery = (serviceId: string | null, id: string | null) => {
  return useQuery({
    queryKey: [...requestLogsQueryKey, "detail", id],
    queryFn: () => RequestLogsApi.get(serviceId!, id!),
    enabled: id !== null && serviceId !== null,
  });
};
