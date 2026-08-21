import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useTenantsQuery } from "../../tenants/hooks/useTenants";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

export const TenantSelecField = () => {
  const { tenantId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useTenantsQuery({ pageable: { page: 0, size: 100 } });

  const tenantOptions = (data?.content ?? []).map((tenant) => ({
    label: tenant.name,
    value: tenant.id,
  }));

  return (
    <FilterSelectWrapper label="Tenant">
      <SelectFilter
        value={tenantId}
        options={tenantOptions}
        onChange={(val) => mergeParams({ tenantId: val })}
        disabled={isFetching}
      />
    </FilterSelectWrapper>
  );
};
