import type { ChangeEvent } from "react";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { ServerSelectField } from "../../../shared/forms/ServerSelectField";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="choose-tenant-title"
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-lg"
      >
        <h2 id="choose-tenant-title" className="text-xl font-semibold text-foreground">
          Choose a tenant
        </h2>
        <p className="mt-1 text-sm text-muted">To visit this page, you need to choose a tenant.</p>

        <div className="mt-4">
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
        </div>
      </div>
    </div>
  );
};
