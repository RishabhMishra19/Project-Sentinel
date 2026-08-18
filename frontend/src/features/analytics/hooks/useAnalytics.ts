import { useQuery } from "@tanstack/react-query";
import { mapPageQuery } from "../../../shared/api/mapQuery";
import { AnalyticsApi } from "../api/AnalyticsApi";
import type {
  AnalyticsQueryParams,
  AnalyticsRankingsParams,
} from "../dto/request/analytics.request";

const analyticsQueryKey = ["analytics"];

export const useAnalyticsSummaryQuery = (params: AnalyticsQueryParams | null) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "summary", params],
    queryFn: () => AnalyticsApi.summary(params!),
    enabled: params != null,
  });
};

export const useAnalyticsTimeseriesQuery = (params: AnalyticsQueryParams | null) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "timeseries", params],
    queryFn: () => AnalyticsApi.timeseries(params!),
    enabled: params != null,
  });
};

export const useAnalyticsRankingsQuery = (params: AnalyticsRankingsParams | null) => {
  return mapPageQuery(
    useQuery({
      queryKey: [...analyticsQueryKey, "rankings", params],
      queryFn: () => AnalyticsApi.rankings(params!),
      enabled: params != null,
    }),
  );
};

export const useEndpointStatusBreakdownQuery = (
  endpointId: string | null,
  from: string,
  to: string,
) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "status", endpointId, from, to],
    queryFn: () => AnalyticsApi.statusBreakdown(endpointId!, { from, to }),
    enabled: endpointId != null,
  });
};

export const useEndpointExceptionsQuery = (endpointId: string | null, from: string, to: string) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "exceptions", endpointId, from, to],
    queryFn: () => AnalyticsApi.exceptions(endpointId!, { from, to }),
    enabled: endpointId != null,
  });
};
