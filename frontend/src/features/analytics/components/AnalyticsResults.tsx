import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsQueryParams,
} from "../dto/request/analytics.request";
import type { AnalyticsEntityAggregatedResponse } from "../dto/response/analytics.response";
import { AnalyticsKpiStrip } from "./AnalyticsKpiStrip";
import { AnalyticsRankingsTable } from "./AnalyticsRankingsTable";
import { AnalyticsTimeseriesCharts } from "./AnalyticsTimeseriesCharts";
import { EndpointStatusChart } from "./EndpointDetailCharts";

type AnalyticsResultsProps = {
  queryParams: AnalyticsQueryParams;
  rankingsParams: AnalyticsEntityAggregatedRequestParams | null;
  onRowClick: (item: AnalyticsEntityAggregatedResponse["items"][0]) => void;
};

export const AnalyticsResults = ({
  queryParams,
  rankingsParams,
  onRowClick,
}: AnalyticsResultsProps) => {
  const isEndpoint = queryParams.scope === "ENDPOINT";
  const endpointId = queryParams.endpointId;

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiStrip params={queryParams} />
      <AnalyticsTimeseriesCharts params={queryParams} />

      {isEndpoint && endpointId ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <EndpointStatusChart
            endpointId={endpointId}
            from={queryParams.from}
            to={queryParams.to}
          />
        </div>
      ) : rankingsParams ? (
        <AnalyticsRankingsTable params={rankingsParams} onRowClick={onRowClick} />
      ) : null}
    </div>
  );
};
