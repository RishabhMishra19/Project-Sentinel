import { SelectField } from "../../../shared/forms/SelectField";
import { useTenantsQuery } from "../../tenants/hooks/useTenants";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";

export const TenantSelecField = () => {
  const { tenantId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useTenantsQuery({ pageable: { page: 0, size: 100 } });

  const tenantOptions = (data?.content ?? []).map((tenant) => ({
    label: tenant.name,
    value: tenant.id,
  }));

  console.log({ tenantId });

  return (
    <SelectField
      value={tenantId ?? undefined}
      onChange={(event) => mergeParams({ tenantId: event.target.value })}
      aria-label="Filter by tenant"
      placeholder="Select Tenant"
      emptyPlaceholder="No Tenants"
      disabled={isFetching}
      options={tenantOptions}
    />
  );
};
