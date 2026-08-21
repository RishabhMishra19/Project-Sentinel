import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useServiceEndpointsQuery } from "../../services/hooks/useServices";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

export const EndpointSelecField = () => {
  const { serviceId, endpointId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useServiceEndpointsQuery(serviceId);

  const endpointOptions = (data ?? []).map((endpoint) => ({
    label: endpoint.pathTemplate,
    value: endpoint.id,
  }));

  return (
    <FilterSelectWrapper label="Endpoint">
      <SelectFilter
        value={endpointId}
        options={endpointOptions}
        onChange={(val) => mergeParams({ endpointId: val })}
        disabled={isFetching}
      />
    </FilterSelectWrapper>
  );
};
