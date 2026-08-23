import { SelectFilter } from "../../../../shared/ui/filters/controls";
import { useServiceEndpointsQuery } from "../../../services/hooks/useServices";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

type EndpointSelecFieldProps = {
  productId: string;
  serviceId: string;
  val: string;
  onChange: (newVal: string) => void;
};

export const EndpointSelecField = ({
  productId,
  serviceId,
  val,
  onChange,
}: EndpointSelecFieldProps) => {
  const { data, isFetching } = useServiceEndpointsQuery(productId, serviceId);

  const endpointOptions = (data ?? []).map((endpoint) => ({
    label: endpoint.method + " :  " + endpoint.pathTemplate,
    value: endpoint.id,
  }));

  return (
    <FilterSelectWrapper label="Endpoint">
      <SelectFilter
        value={val}
        options={endpointOptions}
        onChange={(newVal) =>
          newVal &&
          (() => {
            console.log(newVal);
            return newVal !== "any";
          })() &&
          onChange(newVal)
        }
        disabled={isFetching}
        classname="text-xs h-6"
        hideAnyOption={true}
      />
    </FilterSelectWrapper>
  );
};
