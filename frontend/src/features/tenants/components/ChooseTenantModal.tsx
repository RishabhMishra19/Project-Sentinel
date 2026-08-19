import type { ChangeEvent } from "react";
import type { ListQueryRequest } from "../../../shared/dto/request/listQueryRequest";
import { ServerSelectField } from "../../../shared/forms/ServerSelectField";
import { ModalLayout } from "../../../shared/ui";
import { useTenantsQuery } from "../hooks/useTenants";
import { AuthUtils } from "../../auth/AuthUtils";

const ACTIVE_TENANTS_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

export const ChooseTenantModal = () => {
  const tenantsQuery = useTenantsQuery(ACTIVE_TENANTS_QUERY);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const tenantId = event.target.value;
    if (!tenantId) {
      return;
    }

    const tenant = tenantsQuery.rows.find((row) => row.id === tenantId);
    if (!tenant) {
      return;
    }
    AuthUtils.setActiveTenant(tenant);
  };

  return (
    <ModalLayout
      open
      dismissible={false}
      onClose={() => undefined}
      title="Choose a tenant"
      description="To visit this page, you need to choose a tenant."
    >
      <ServerSelectField
        label="Tenant"
        query={tenantsQuery}
        toOption={(tenant) => ({ value: tenant.id, label: tenant.name })}
        placeholder="Select a tenant"
        loadingPlaceholder="Loading tenants…"
        emptyPlaceholder="No tenants available"
        emptyMessage="No active tenants found."
        errorMessage="Could not load tenants."
        value=""
        onChange={handleChange}
      />
    </ModalLayout>
  );
};
