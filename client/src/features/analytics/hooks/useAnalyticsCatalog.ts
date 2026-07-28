import { useMemo } from "react";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery, useServiceEndpointsQuery } from "../../services/hooks/useServices";
import type { AnalyticsScope } from "../dto/request/analytics.request";

const ACTIVE_SERVICES_QUERY = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

const PRODUCTS_QUERY = {
  pageable: { page: 0, size: 100 },
} as const;

export const useAnalyticsCatalog = (scope: AnalyticsScope, serviceId?: string) => {
  const productsQuery = useProductsQuery(scope === "PRODUCT" ? PRODUCTS_QUERY : null);
  const servicesQuery = useAllServicesQuery(
    scope === "SERVICE" || scope === "ENDPOINT" ? ACTIVE_SERVICES_QUERY : null,
  );
  const endpointsQuery = useServiceEndpointsQuery(scope === "ENDPOINT" ? serviceId : undefined);

  const products = productsQuery.rows;
  const services = servicesQuery.rows;
  const endpoints = endpointsQuery.rows;

  const productOptions = useMemo(
    () => products.map((p) => ({ label: p.name, value: p.id })),
    [products],
  );
  const serviceOptions = useMemo(
    () =>
      services.map((s) => ({
        label: `${s.productName} / ${s.name}`,
        value: s.id,
      })),
    [services],
  );
  const endpointOptions = useMemo(
    () =>
      endpoints.map((ep) => ({
        label: `${ep.method} ${ep.pathTemplate}`,
        value: ep.id,
      })),
    [endpoints],
  );

  return {
    products,
    services,
    endpoints,
    endpointsReady: endpointsQuery.isSuccess,
    productOptions,
    serviceOptions,
    endpointOptions,
  };
};
