import { SelectFilter } from "../../../../shared/ui/filters/controls";
import { useServiceEndpointsQuery } from "../../../services/hooks/useServices";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

type EndpointSelecFieldProps = {
  serviceId: string;
  val: string;
  onChange: (newVal: string) => void;
};

export const EndpointSelecField = ({ serviceId, val, onChange }: EndpointSelecFieldProps) => {
  const { data, isFetching } = useServiceEndpointsQuery(serviceId);

  const endpointOptions = (data ?? []).map((endpoint) => ({
    label: endpoint.pathTemplate,
    value: endpoint.id,
  }));

  return (
    <FilterSelectWrapper label="Endpoint">
      <SelectFilter
        value={val}
        options={endpointOptions}
        onChange={(newVal) => newVal && onChange(newVal)}
        disabled={isFetching}
        classname="text-xs h-6"
      />
    </FilterSelectWrapper>
  );
};
