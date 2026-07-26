import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
import type { FiltersChange, FiltersConfig, FilterField } from "../../../shared/ui/filters";
import type { AnalyticsScope } from "../dto/request/analytics.request";
import type { AnalyticsRankingItem } from "../dto/response/analytics.response";
import {
  buildAnalyticsFilterFields,
  filtersFromSearchParams,
  mapAnalyticsFiltersToPatch,
} from "../utils/analyticsFilters";
import {
  buildAnalyticsQueryParams,
  buildAnalyticsRankingsParams,
  buildLogsSearchParams,
  rankingClickPatch,
  tabChangePatch,
  withServiceProductCascade,
} from "../utils/analyticsUrl";
import { useAnalyticsCatalog } from "./useAnalyticsCatalog";
import { useAnalyticsSearchParams } from "./useAnalyticsSearchParams";
import { useAnalyticsSelectionDefaults } from "./useAnalyticsSelectionDefaults";

export const useAnalyticsUrlState = () => {
  const navigate = useNavigate();
  const {
    params,
    scope,
    productId,
    serviceId,
    endpointId,
    from,
    to,
    bucket,
    patchParams,
  } = useAnalyticsSearchParams();

  const catalog = useAnalyticsCatalog(scope, serviceId);
  const ids = useMemo(
    () => ({ productId, serviceId, endpointId }),
    [productId, serviceId, endpointId],
  );

  useAnalyticsSelectionDefaults(scope, ids, catalog, patchParams);

  const filters = useMemo(() => filtersFromSearchParams(params, scope), [params, scope]);

  const filterFields: FilterField[] = useMemo(
    () =>
      buildAnalyticsFilterFields({
        scope,
        productOptions: catalog.productOptions,
        serviceOptions: catalog.serviceOptions,
        endpointOptions: catalog.endpointOptions,
      }),
    [scope, catalog.productOptions, catalog.serviceOptions, catalog.endpointOptions],
  );

  const onFiltersChange = useCallback(
    (next: FiltersChange) => {
      const mapped = mapAnalyticsFiltersToPatch(next, scope, ids);
      const cascaded = withServiceProductCascade(mapped, scope, catalog.services);
      patchParams({
        productId: cascaded.productId,
        serviceId: cascaded.serviceId,
        endpointId: cascaded.endpointId,
        from: cascaded.from,
        to: cascaded.to,
        bucket: cascaded.bucket,
      });
    },
    [scope, ids, catalog.services, patchParams],
  );

  const filtersConfig: FiltersConfig = useMemo(
    () => ({
      filters,
      onFiltersChange,
    }),
    [filters, onFiltersChange],
  );

  const queryParams = useMemo(
    () => buildAnalyticsQueryParams(scope, ids, { from, to, bucket }),
    [scope, ids, from, to, bucket],
  );
  const rankingsParams = useMemo(
    () => buildAnalyticsRankingsParams(queryParams),
    [queryParams],
  );

  const setTab = useCallback(
    (nextScope: AnalyticsScope) => {
      patchParams(tabChangePatch(nextScope, { from, to, bucket }));
    },
    [patchParams, from, to, bucket],
  );

  const onRankingClick = useCallback(
    (item: AnalyticsRankingItem) => {
      const patch = rankingClickPatch(scope, item, ids);
      if (patch) patchParams(patch);
    },
    [scope, ids, patchParams],
  );

  const openInLogs = useCallback(() => {
    const q = buildLogsSearchParams(scope, { from, to }, ids);
    navigate(`/${ROUTE_PATHS.logs}?${q.toString()}`);
  }, [navigate, scope, from, to, ids]);

  return {
    scope,
    scopeReady: queryParams != null,
    queryParams,
    rankingsParams,
    filterFields,
    filtersConfig,
    setTab,
    openInLogs,
    onRankingClick,
  };
};
