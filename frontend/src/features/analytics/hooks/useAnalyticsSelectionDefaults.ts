import { useEffect } from "react";
import type { AnalyticsScope } from "../dto/request/analytics.request";
import {
  resolveDefaultSelectionPatch,
  type AnalyticsSelectionIds,
  type AnalyticsUrlPatch,
} from "../utils/analyticsUrl";

type CatalogSlice = {
  products: { id: string }[];
  services: { id: string; productId: string }[];
  endpoints: { id: string }[];
  endpointsReady: boolean;
};

/**
 * Default each scoped tab to the first available catalog value when the URL
 * selection is missing or no longer present in the list.
 */
export const useAnalyticsSelectionDefaults = (
  scope: AnalyticsScope,
  ids: AnalyticsSelectionIds,
  catalog: CatalogSlice,
  patchParams: (patch: AnalyticsUrlPatch) => void,
) => {
  const { productId, serviceId, endpointId } = ids;
  const { products, services, endpoints, endpointsReady } = catalog;

  useEffect(() => {
    const patch = resolveDefaultSelectionPatch(
      scope,
      { productId, serviceId, endpointId },
      { products, services, endpoints, endpointsReady },
    );
    if (patch) patchParams(patch);
  }, [
    scope,
    productId,
    serviceId,
    endpointId,
    products,
    services,
    endpoints,
    endpointsReady,
    patchParams,
  ]);
};
