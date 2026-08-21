import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsQueryParams,
} from "../dto/request/analytics.request";
import type { AnalyticsEntityAggregatedResponse } from "../dto/response/analytics.response";
import { getEntityAggregatedRequestParams } from "../utils/analyticsUrl";
import { AnalyticsKpiStrip } from "./AnalyticsKpiStrip";
import { AnalyticsRankingsTable } from "./AnalyticsRankingsTable";
import { AnalyticsTimeseriesCharts } from "./AnalyticsTimeseriesCharts";
import { EndpointStatusChart } from "./EndpointDetailCharts";

type AnalyticsResultsProps = {
  queryParams: AnalyticsQueryParams;
  onRowClick: (item: AnalyticsEntityAggregatedResponse["items"][0]) => void;
};

export const AnalyticsResults = ({ queryParams, onRowClick }: AnalyticsResultsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiStrip params={queryParams} />
      <AnalyticsTimeseriesCharts params={queryParams} />
      <div className="grid gap-4 lg:grid-cols-2">
        <EndpointStatusChart params={queryParams} />
      </div>
      <AnalyticsRankingsTable params={queryParams} onRowClick={onRowClick} />
    </div>
  );
};
