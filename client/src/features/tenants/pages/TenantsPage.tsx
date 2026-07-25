import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../../redux/hooks';
import { setActiveTenant } from '../../../redux/session/sessionSlice';
import { TENANT_CONTEXT_ROUTES } from '../../../routes/paths';
import type { CreateTenantResponse, TenantResponse } from '../dto/response/tenant.response'
import { DeactivateTenantDialog } from "../components/DeactivateTenantDialog";
import { TenantFormModal } from "../components/TenantFormModal";
import { TenantsTable } from "../components/TenantsTable";
import { TenantViewModal } from "../components/TenantViewModal";
import { TempPasswordRevealDialog } from "../../users/components/TempPasswordRevealDialog";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; tenant: TenantResponse };

export const TenantsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [viewTenant, setViewTenant] = useState<TenantResponse | null>(null);
  const [deactivateTenant, setDeactivateTenant] =
    useState<TenantResponse | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  const onCreated = (created: CreateTenantResponse) => {
    setRevealedPassword(created.temporaryPassword);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <TenantsTable
        onCreate={() => setFormState({ open: true, mode: "create" })}
        onView={setViewTenant}
        onEdit={(tenant) => setFormState({ open: true, mode: "edit", tenant })}
        onStartSession={(tenant) => {
          dispatch(setActiveTenant({ id: tenant.id, name: tenant.name }));
          navigate(TENANT_CONTEXT_ROUTES.PRODUCTS);
        }}
        onDeactivate={setDeactivateTenant}
      />

      <TenantFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        tenant={
          formState.open && formState.mode === "edit" ? formState.tenant : null
        }
        onClose={() => setFormState({ open: false })}
        onCreated={onCreated}
      />

      <TempPasswordRevealDialog
        open={revealedPassword != null}
        temporaryPassword={revealedPassword}
        onClose={() => setRevealedPassword(null)}
        title="Tenant admin temporary password"
        description="As Sentinel admin, copy this password now and share it securely with the tenant admin. It will not be shown again."
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
