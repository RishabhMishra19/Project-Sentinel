import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import { AnalyticsEmptyState } from "../components/AnalyticsEmptyState";
import { AnalyticsResults } from "../components/AnalyticsResults";
import { AnalyticsToolbar } from "../components/AnalyticsToolbar";
import { useAnalyticsUrlState } from "../hooks/useAnalyticsUrlState";

export const AnalyticsPage = () => {
  const {
    scope,
    scopeReady,
    queryParams,
    rankingsParams,
    filterFields,
    filtersConfig,
    setTab,
    openInLogs,
    onRankingClick,
  } = useAnalyticsUrlState();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AnalyticsToolbar
        scope={scope}
        scopeReady={scopeReady}
        filterFields={filterFields}
        filtersConfig={filtersConfig}
        onTabChange={setTab}
        onOpenInLogs={openInLogs}
      />

      {!scopeReady || !queryParams ? (
        <AnalyticsEmptyState scope={scope} />
      ) : (
        <AnalyticsResults
          queryParams={queryParams}
          rankingsParams={rankingsParams}
          onRankingClick={onRankingClick}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Need raw events?{" "}
        <Link className="underline" to={`/${ROUTE_PATHS.logs}`}>
          Open Logs
        </Link>
      </p>
    </div>
  );
};
