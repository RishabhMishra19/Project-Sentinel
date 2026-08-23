import type { AnalyticsBucketType } from "../../dto/request/analytics.request";
import { useAnalyticsUrlState } from "../../hooks/useAnalyticsUrlState";
import { AnalyticsScope } from "../../utils/analytics.constants";
import { BucketSelecField } from "./BucketSelecField";
import { EndpointSelecField } from "./EndpointSelecField";
import { ProductSelecField } from "./ProductSelecField";
import { ServiceSelectField } from "./ServiceSelectField";
import { TimeRangeSelecField } from "./TimeRangeSelecField";

export const AnalyticsToolbar = () => {
  const { validState, updateState } = useAnalyticsUrlState();

  return (
    <div className="flex flex-row justify-end gap-4">
      {validState.scope === AnalyticsScope.PRODUCT && (
        <ProductSelecField
          val={validState.productId}
          onChange={(val) => updateState({ ...validState, productId: val })}
        />
      )}
      {validState.scope === AnalyticsScope.SERVICE && (
        <ServiceSelectField
          productId={validState.productId}
          val={validState.serviceId}
          onChange={(val) => updateState({ ...validState, serviceId: val })}
        />
      )}
      {validState.scope === AnalyticsScope.ENDPOINT && (
        <EndpointSelecField
          productId={validState.productId}
          serviceId={validState.serviceId}
          val={validState.endpointId}
          onChange={(val) => updateState({ ...validState, endpointId: val })}
        />
      )}
      <BucketSelecField
        val={validState.bucket}
        onChange={(val) => updateState({ ...validState, bucket: val as AnalyticsBucketType })}
      />
      <TimeRangeSelecField
        val={{ from: validState.from, to: validState.to }}
        onChange={({ from, to }) => updateState({ ...validState, from, to })}
      />
    </div>
  );
};
