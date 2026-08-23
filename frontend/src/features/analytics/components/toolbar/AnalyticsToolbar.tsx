import type { AnalyticsBucketType } from "../../dto/request/analytics.request";
import { useAnalyticsUrlState } from "../../hooks/useAnalyticsUrlState";
import { AnalyticsScope } from "../../utils/analytics.constants";
import { BucketSelecField } from "./BucketSelecField";
import { AnalyticsSelecField } from "./AnalyticsSelecField";
import { TimeRangeSelecField } from "./TimeRangeSelecField";

export const AnalyticsToolbar = () => {
  const { validState, updateState, productOptions, serviceOptions, endpointOptions } =
    useAnalyticsUrlState();

  return (
    <div className="flex flex-row justify-end gap-4">
      {validState.scope === AnalyticsScope.PRODUCT && (
        <AnalyticsSelecField
          label="Product"
          val={validState.productId}
          onChange={(val) => updateState({ ...validState, productId: val })}
          options={productOptions}
        />
      )}
      {validState.scope === AnalyticsScope.SERVICE && (
        <AnalyticsSelecField
          label="Service"
          val={validState.serviceId}
          onChange={(val) => updateState({ ...validState, serviceId: val })}
          options={serviceOptions}
        />
      )}
      {validState.scope === AnalyticsScope.ENDPOINT && (
        <AnalyticsSelecField
          label="Endpoint"
          val={validState.endpointId}
          onChange={(val) => updateState({ ...validState, endpointId: val })}
          options={endpointOptions}
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
