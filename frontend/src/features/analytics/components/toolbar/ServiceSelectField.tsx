import { SelectFilter } from "../../../../shared/ui/filters/controls";
import { useServicesQuery } from "../../../services/hooks/useServices";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

type ServiceSelectFieldProps = {
  productId: string;
  val: string;
  onChange: (newVal: string) => void;
};

export const ServiceSelectField = ({ productId, val, onChange }: ServiceSelectFieldProps) => {
  const { data, isFetching } = useServicesQuery(productId, {
    pageable: { page: 0, size: 100 },
  });

  const serviceOptions = (data?.content ?? []).map((service) => ({
    label: service.name,
    value: service.id,
  }));

  return (
    <FilterSelectWrapper label="Service">
      <SelectFilter
        value={val}
        options={serviceOptions}
        onChange={(newVal) => newVal && onChange(newVal)}
        disabled={isFetching}
        classname="text-xs h-6"
        hideAnyOption={true}
      />
    </FilterSelectWrapper>
  );
};
