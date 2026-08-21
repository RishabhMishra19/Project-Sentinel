export type AnalyticsScope = "TENANT" | "PRODUCT" | "SERVICE" | "ENDPOINT";

export type AnalyticsBucket = "MINUTE" | "HOUR" | "DAY";

export type AnalyticsRankingSort = "TRAFFIC" | "ERROR_RATE" | "P95";

export type AnalyticsSummaryRequestParams = {
  scope: AnalyticsScope;
  bucket: AnalyticsBucket;
  from: string;
  to: string;
  entityId: string;
};

export type AnalyticsEntityAggregatedRequestParams = {
  scope: AnalyticsScope;
  bucket: AnalyticsBucket;
  from: string;
  to: string;
  tenantId?: string;
  productId?: string;
  serviceId?: string;
};

export type AnalyticsQueryParams = {
  scope: AnalyticsScope;
  productId?: string;
  serviceId?: string;
  endpointId?: string;
  from: string;
  to: string;
  bucket: AnalyticsBucket;
};
