import { SelectField } from "../../../shared/forms/SelectField";
import { useServiceEndpointsQuery, useServicesQuery } from "../../services/hooks/useServices";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";

export const EndpointSelecField = () => {
  const { serviceId, endpointId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useServiceEndpointsQuery(serviceId);

  const endpointOptions = (data ?? []).map((endpoint) => ({
    label: endpoint.pathTemplate,
    value: endpoint.id,
  }));

  return (
    <SelectField
      value={endpointId ?? undefined}
      onChange={(event) => mergeParams({ endpoint: event.target.value })}
      aria-label="Filter by endpoint"
      placeholder="Select Endpoint"
      emptyPlaceholder="No Endpoints"
      disabled={isFetching}
      options={endpointOptions}
    />
  );
};
