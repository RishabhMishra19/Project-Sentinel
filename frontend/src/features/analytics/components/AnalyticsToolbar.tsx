import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { BucketSelecField } from "./BucketSelecField";
import { EndpointSelecField } from "./EndpointSelecField";
import { ProductSelecField } from "./ProductSelecField";
import { ScopeSelecField } from "./ScopeSelecField";
import { ServiceSelecField } from "./ServiceSelecField";
import { TenantSelecField } from "./TenantSelecField";
import { TimeRangeSelecField } from "./TimeRangeSelecField";

export const AnalyticsToolbar = () => {
  const { scope, tenantId, productId, serviceId, endpointId, from, to, bucket } =
    useAnalyticsSearchParams();

  console.log({ productId });
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-wrap gap-2">
        <ScopeSelecField key={"scope" + scope} />
        {["TENANT", "PRODUCT", "SERVICE", "ENDPOINT"].includes(scope as any) && (
          <TenantSelecField key={"tenant" + tenantId} />
        )}
        {["PRODUCT", "SERVICE", "ENDPOINT"].includes(scope as any) && (
          <ProductSelecField key={"product" + productId} />
        )}
        {["SERVICE", "ENDPOINT"].includes(scope as any) && (
          <ServiceSelecField key={"service" + serviceId} />
        )}
        {["ENDPOINT"].includes(scope as any) && (
          <EndpointSelecField key={"endpoint" + endpointId} />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <BucketSelecField key={"bucket" + bucket} />
        <TimeRangeSelecField key={"timerange" + (from ?? "") + (to ?? "")} />
      </div>
    </div>
  );
};
