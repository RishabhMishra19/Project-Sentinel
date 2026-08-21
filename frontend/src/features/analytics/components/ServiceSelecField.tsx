import { SelectField } from "../../../shared/forms/SelectField";
import { useServicesQuery } from "../../services/hooks/useServices";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";

export const ServiceSelecField = () => {
  const { serviceId, productId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useServicesQuery(productId, { pageable: { page: 0, size: 100 } });

  const serviceOptions = (data?.content ?? []).map((service) => ({
    label: service.name,
    value: service.id,
  }));

  return (
    <SelectField
      value={serviceId ?? undefined}
      onChange={(event) => mergeParams({ serviceId: event.target.value })}
      aria-label="Filter by service"
      placeholder="Select Service"
      emptyPlaceholder="No Services"
      disabled={isFetching}
      options={serviceOptions}
    />
  );
};
