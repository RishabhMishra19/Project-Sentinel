import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { AnalyticsBucket, AnalyticsScope } from "../utils/analytics.constants";
import { isValidDate } from "../../../shared/utils/dateUtils";
import type { AnalyticsBucketType, AnalyticsScopeType } from "../dto/request/analytics.request";
import { useEffect } from "react";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useServiceEndpointsQuery, useServicesQuery } from "../../services/hooks/useServices";

type AnalyticsUrlState =
  | {
      from: string;
      to: string;
      bucket: AnalyticsBucketType;
      scope: "TENANT";
      tenantId: string;
      productId: null;
      serviceId: null;
      endpointId: null;
    }
  | {
      from: string;
      to: string;
      bucket: AnalyticsBucketType;
      scope: "PRODUCT";
      tenantId: string;
      productId: string;
      serviceId: null;
      endpointId: null;
    }
  | {
      from: string;
      to: string;
      bucket: AnalyticsBucketType;
      scope: "SERVICE";
      tenantId: string;
      productId: string;
      serviceId: string;
      endpointId: null;
    }
  | {
      from: string;
      to: string;
      bucket: AnalyticsBucketType;
      scope: "ENDPOINT";
      tenantId: string;
      productId: string;
      serviceId: string;
      endpointId: string;
    };

const getValidBucket = (bucket: string | null): AnalyticsBucketType => {
  switch (bucket) {
    case AnalyticsBucket.MINUTE:
      return AnalyticsBucket.MINUTE;
    case AnalyticsBucket.HOUR:
      return AnalyticsBucket.HOUR;
    case AnalyticsBucket.DAY:
      return AnalyticsBucket.DAY;
  }
  return AnalyticsBucket.MINUTE;
};

const getValidDateRange = (from: string | null, to: string | null) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (!from || !to || !isValidDate(from) || !isValidDate(to)) {
    return { from: twentyFourHoursAgo.toISOString(), to: now.toISOString() };
  }
  return { from, to };
};

const convertSearchParamsToValidState = (
  searchParams: URLSearchParams,
  activeTenantId: string,
): AnalyticsUrlState => {
  const scope = searchParams.get("scope");
  const bucket = getValidBucket(searchParams.get("bucket"));
  const { from, to } = getValidDateRange(searchParams.get("from"), searchParams.get("to"));
  const tenantId = searchParams.get("tenantId") ?? activeTenantId;
  const productId = searchParams.get("productId");
  const serviceId = searchParams.get("serviceId");
  const endpointId = searchParams.get("endpointId");
  if (scope === "PRODUCT")
    if (scope === AnalyticsScope.PRODUCT && !!productId) {
      return {
        scope,
        bucket,
        from,
        to,
        tenantId,
        productId: productId,
        serviceId: null,
        endpointId: null,
      };
    }
  if (scope === AnalyticsScope.SERVICE && !!productId && !!serviceId) {
    return {
      scope,
      bucket,
      from,
      to,
      tenantId,
      productId: productId,
      serviceId: serviceId,
      endpointId: null,
    };
  }
  if (scope === AnalyticsScope.ENDPOINT && !!productId && !!serviceId && !!endpointId) {
    return {
      scope,
      bucket,
      from,
      to,
      tenantId,
      productId: productId,
      serviceId: serviceId,
      endpointId: endpointId,
    };
  }
  return {
    scope: "TENANT",
    bucket,
    from,
    to,
    tenantId,
    productId: null,
    serviceId: null,
    endpointId: null,
  };
};

const covertSearchParamsToState = (searchParams: URLSearchParams) => {
  return {
    scope: searchParams.get("scope"),
    bucket: searchParams.get("bucket"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    tenantId: searchParams.get("tenantId"),
    productId: searchParams.get("productId"),
    serviceId: searchParams.get("serviceId"),
    endpointId: searchParams.get("endpointId"),
  };
};

const convertValidStateToSearchParams = (validState: AnalyticsUrlState) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(validState)) {
    if (value !== null) {
      searchParams.set(key, value);
    }
  }
  return searchParams;
};

export const useAnalyticsUrlState = () => {
  const activeTenant = useAppSelector((state) => state.session.activeTenant!);
  const [searchParams, setSearchParams] = useSearchParams();

  const validState = convertSearchParamsToValidState(searchParams, activeTenant.id);

  const productQuery = useProductsQuery({ pageable: { page: 0, size: 100 } });

  const serviceQuery = useServicesQuery(validState.productId, {
    pageable: { page: 0, size: 100 },
  });

  const endpointQuery = useServiceEndpointsQuery(validState.productId, validState.serviceId);

  const productOptions = (productQuery.data?.content ?? []).map((product) => ({
    label: product.name,
    value: product.id,
  }));

  const serviceOptions = (serviceQuery.data?.content ?? []).map((service) => ({
    label: service.name,
    value: service.id,
  }));

  const endpointOptions = (endpointQuery.data ?? []).map((endpoint) => ({
    label: endpoint.method + " :  " + endpoint.pathTemplate,
    value: endpoint.id,
  }));

  useEffect(() => {
    const urlState = covertSearchParamsToState(searchParams);
    if (JSON.stringify(urlState) !== JSON.stringify(validState)) {
      const validSearchParams = convertValidStateToSearchParams(validState);
      setSearchParams(validSearchParams, { replace: true });
    }
  }, [validState, searchParams, setSearchParams]);

  const updateState = (newValidState: AnalyticsUrlState) => {
    const newValidSearchParams = convertValidStateToSearchParams(newValidState);
    setSearchParams(newValidSearchParams);
  };

  const entityId = {
    [AnalyticsScope.TENANT]: validState.tenantId,
    [AnalyticsScope.PRODUCT]: validState.productId,
    [AnalyticsScope.SERVICE]: validState.serviceId,
    [AnalyticsScope.ENDPOINT]: validState.endpointId,
  }[validState.scope];

  const selectedTenant = activeTenant.name;
  const selectedProduct = productOptions.find((v) => v.value === validState.productId)?.label;
  const selectedService = serviceOptions.find((v) => v.value === validState.serviceId)?.label;
  const selectedEndpoint = endpointOptions.find((v) => v.value === validState.endpointId)?.label;

  return {
    entityId: entityId as string,
    validState,
    updateState,
    productOptions,
    serviceOptions,
    endpointOptions,
    selectedTenant,
    selectedProduct,
    selectedService,
    selectedEndpoint,
  };
};
