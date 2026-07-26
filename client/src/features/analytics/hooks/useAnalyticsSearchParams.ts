import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { dateRangeFromPreset } from "../../../shared/ui/filters";
import { dateToFromIso, dateToToIso } from "../utils/analyticsFilters";
import {
  applyAnalyticsUrlPatch,
  parseScope,
  type AnalyticsUrlPatch,
} from "../utils/analyticsUrl";
import { parseBucket, suggestedBucket } from "../utils/timeRange";

export const useAnalyticsSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const defaultRange = useMemo(() => {
    const dates = dateRangeFromPreset("1d");
    return {
      from: dateToFromIso(dates.from),
      to: dateToToIso(dates.to),
    };
  }, []);

  const scope = parseScope(params.get("tab")?.toUpperCase() ?? params.get("scope"));
  const productId = params.get("productId") ?? undefined;
  const serviceId = params.get("serviceId") ?? undefined;
  const endpointId = params.get("endpointId") ?? undefined;
  const from = params.get("from") ?? defaultRange.from;
  const to = params.get("to") ?? defaultRange.to;
  const bucket = parseBucket(params.get("bucket")) ?? suggestedBucket(from, to);

  const patchParams = useCallback(
    (patch: AnalyticsUrlPatch) => {
      setParams((prev) => applyAnalyticsUrlPatch(prev, patch, defaultRange), {
        replace: true,
      });
    },
    [setParams, defaultRange],
  );

  // Persist required bucket in the URL when missing / invalid.
  useEffect(() => {
    if (parseBucket(params.get("bucket")) != null) return;
    setParams(
      (prev) => {
        if (parseBucket(prev.get("bucket")) != null) return prev;
        return applyAnalyticsUrlPatch(prev, { from, to, bucket }, defaultRange);
      },
      { replace: true },
    );
  }, [params, from, to, bucket, defaultRange, setParams]);

  return {
    params,
    scope,
    productId,
    serviceId,
    endpointId,
    from,
    to,
    bucket,
    patchParams,
  };
};
