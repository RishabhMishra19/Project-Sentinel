import { PageContent } from "../../../shared/layout/PageContent";
import {
  AnalyticsErrorRateChart,
  AnalyticsLatencyChart,
  AnalyticsStatusChart,
  AnalyticsVolumeChart,
} from "../components/AnalyticsCharts";
import { AnalyticsKpiStrip } from "../components/AnalyticsKpiStrip";
import { AnalyticsRankingTable } from "../components/AnalyticsRankingsTable";
import { AnalyticsToolbar } from "../components/toolbar/AnalyticsToolbar";
import { TrafficSummary } from "../components/TrafficSummary";
import {
  useAnalyticsEntityAggregatedQuery,
  useAnalyticsSummaryQuery,
  useAnalyticsTimeseriesQuery,
} from "../hooks/useAnalytics";
import { useAnalyticsUrlState } from "../hooks/useAnalyticsUrlState";
import { AnalyticsScope } from "../utils/analytics.constants";

const RankMapping = {
  [AnalyticsScope.TENANT]: "Product",
  [AnalyticsScope.PRODUCT]: "Service",
  [AnalyticsScope.SERVICE]: "Endpoint",
};

export const AnalyticsPage = () => {
  const { validState } = useAnalyticsUrlState();
  const timeSeries = useAnalyticsTimeseriesQuery();
  const summary = useAnalyticsSummaryQuery();
  const entityAggregated = useAnalyticsEntityAggregatedQuery();

  return (
    <PageContent className="m-0 p-0">
      <div className="flex justify-between py-2">
        <AnalyticsKpiStrip />
        <AnalyticsToolbar />
      </div>
      <TrafficSummary totalStats={summary.data?.totalStats} />
      <div className="flex justify-between flex-wrap">
        <AnalyticsVolumeChart {...timeSeries} />
        <AnalyticsLatencyChart {...timeSeries} />
        <AnalyticsErrorRateChart {...timeSeries} />
        <AnalyticsStatusChart {...summary} />
      </div>
      {validState.scope != AnalyticsScope.ENDPOINT && (
        <div className="flex justify-between flex-wrap pb-2">
          <AnalyticsRankingTable
            title={`Top ${RankMapping[validState.scope]}s`}
            entityLabel={RankMapping[validState.scope]}
            items={(entityAggregated.data?.entityAggregatedStats ?? []).toSorted(
              (a, b) => b.requestCount - a.requestCount,
            )}
          />
          <AnalyticsRankingTable
            title={`Error Prone ${RankMapping[validState.scope]}s`}
            entityLabel={RankMapping[validState.scope]}
            items={(entityAggregated.data?.entityAggregatedStats ?? []).toSorted(
              (a, b) => b.errorCount - a.errorCount,
            )}
          />
        </div>
      )}
    </PageContent>
  );
};
