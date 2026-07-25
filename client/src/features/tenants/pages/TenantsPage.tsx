import { useState } from "react";
import { useAppDispatch } from '../../../redux/hooks';
import { setActiveTenant } from '../../../redux/session/sessionSlice';
import type { TenantResponse } from '../dto/response/tenant.response'
import { DeactivateTenantDialog } from "../components/DeactivateTenantDialog";
import { TenantFormModal } from "../components/TenantFormModal";
import { TenantsTable } from "../components/TenantsTable";
import { TenantViewModal } from "../components/TenantViewModal";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; tenant: TenantResponse };

export const TenantsPage = () => {
  const dispatch = useAppDispatch();
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
        onLogin={(tenant) =>
          dispatch(setActiveTenant({ id: tenant.id, name: tenant.name }))
        }
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
