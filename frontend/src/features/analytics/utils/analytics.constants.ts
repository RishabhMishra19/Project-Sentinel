import type { AnalyticsBucketType, AnalyticsScopeType } from "../dto/request/analytics.request";

export const AnalyticsBucket = {
  MINUTE: "MINUTE",
  HOUR: "HOUR",
  DAY: "DAY",
} as const satisfies {
  [K in AnalyticsBucketType]: K;
};

export const AnalyticsScope = {
  TENANT: "TENANT",
  PRODUCT: "PRODUCT",
  SERVICE: "SERVICE",
  ENDPOINT: "ENDPOINT",
} as const satisfies {
  [K in AnalyticsScopeType]: K;
};

export const SCOPE_OPTIONS = [
  { label: "Tenant", value: AnalyticsScope.TENANT },
  { label: "Product", value: AnalyticsScope.PRODUCT },
  { label: "Service", value: AnalyticsScope.SERVICE },
  { label: "Endpoint", value: AnalyticsScope.ENDPOINT },
];

export const BUCKET_OPTIONS = [
  { label: "Minute", value: AnalyticsBucket.MINUTE },
  { label: "Hour", value: AnalyticsBucket.HOUR },
  { label: "Day", value: AnalyticsBucket.DAY },
];
