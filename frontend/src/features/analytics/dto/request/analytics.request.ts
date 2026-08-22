export type AnalyticsScopeType = "TENANT" | "PRODUCT" | "SERVICE" | "ENDPOINT";

export type AnalyticsBucketType = "MINUTE" | "HOUR" | "DAY";

export type AnalyticsSummaryRequestParams = {
  scope: AnalyticsScopeType;
  entityId: string;
  from: string;
  to: string;
};

export type AnalyticsTimeSeriesRequestParams = {
  bucket: AnalyticsBucketType;
  scope: AnalyticsScopeType;
  entityId: string;
  from: string;
  to: string;
};

export type AnalyticsEntityAggregatedRequestParams = {
  scope: AnalyticsScopeType;
  entityId: string;
  from: string;
  to: string;
};
