import { AnalyticsBucket, AnalyticsScope } from "../../utils/analytics.constants";

export type AnalyticsStatsMetrics = {
  entityId: string;
  bucketStart: Date;
  requestCount: number;
  errorCount: number;
  errorRate: number;
  status2xx: number;
  status3xx: number;
  status4xx: number;
  status5xx: number;
  latencyMinMs: number;
  latencyMaxMs: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  latencyP99Ms: number;
  requestBytesTotal: number;
  responseBytesTotal: number;
};

export type AnalyticsSummaryResponse = {
  bucket: keyof typeof AnalyticsBucket;
  scope: keyof typeof AnalyticsScope;
  entityId: string;
  totalStats: AnalyticsStatsMetrics;
  endpointCount: number;
};

export type AnalyticsTimeSeriesResponse = {
  bucket: keyof typeof AnalyticsBucket;
  scope: keyof typeof AnalyticsScope;
  entityId: string;
  timeSeriesStats: AnalyticsStatsMetrics[];
  endpointCount: number;
};

export type AnalyticsEntityAggregatedResponse = {
  bucket: keyof typeof AnalyticsBucket;
  scope: keyof typeof AnalyticsScope;
  entityIds: string[];
  entityAggregatedStats: AnalyticsStatsMetrics[];
  endpointCountMap: Record<string, number>;
};
