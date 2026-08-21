import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useServicesQuery } from "../../services/hooks/useServices";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

export const ServiceSelecField = () => {
  const { serviceId, productId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useServicesQuery(productId, { pageable: { page: 0, size: 100 } });

  const serviceOptions = (data?.content ?? []).map((service) => ({
    label: service.name,
    value: service.id,
  }));

  return (
    <FilterSelectWrapper label="Service">
      <SelectFilter
        value={serviceId}
        options={serviceOptions}
        onChange={(val) => mergeParams({ serviceId: val })}
        disabled={isFetching}
      />
    </FilterSelectWrapper>
  );
};
