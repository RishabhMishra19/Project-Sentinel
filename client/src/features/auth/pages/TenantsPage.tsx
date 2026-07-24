import { useState } from "react";
import type { TenantResponse } from "../dto/tenant.dto";
import { DeactivateTenantDialog } from "../tenants/DeactivateTenantDialog";
import { TenantFormModal } from "../tenants/TenantFormModal";
import { TenantsTable } from "../tenants/TenantsTable";
import { TenantViewModal } from "../tenants/TenantViewModal";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; tenant: TenantResponse };

export const TenantsPage = () => {
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [viewTenant, setViewTenant] = useState<TenantResponse | null>(null);
  const [deactivateTenant, setDeactivateTenant] =
    useState<TenantResponse | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <TenantsTable
        onCreate={() => setFormState({ open: true, mode: "create" })}
        onView={setViewTenant}
        onEdit={(tenant) => setFormState({ open: true, mode: "edit", tenant })}
        onDeactivate={setDeactivateTenant}
      />

      <TenantFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        tenant={
          formState.open && formState.mode === "edit" ? formState.tenant : null
        }
        onClose={() => setFormState({ open: false })}
      />

      <TenantViewModal
        open={viewTenant != null}
        tenant={viewTenant}
        onClose={() => setViewTenant(null)}
      />

      <DeactivateTenantDialog
        open={deactivateTenant != null}
        tenant={deactivateTenant}
        onClose={() => setDeactivateTenant(null)}
      />
    </div>
  );
};
