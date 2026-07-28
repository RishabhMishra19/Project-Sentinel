import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SecretRevealDialog } from "../../../shared/ui";
import type { CreateTenantResponse, TenantResponse } from "../dto/response/tenant.response";
import { DeactivateTenantDialog } from "../components/DeactivateTenantDialog";
import { TenantCreateModal } from "../components/TenantCreateModal";
import { TenantEditModal } from "../components/TenantEditModal";
import { TenantsTable } from "../components/TenantsTable";
import { TenantViewModal } from "../components/TenantViewModal";
import { AuthUtils } from "../../auth/AuthUtils";
import { ROUTE_PATHS } from "../../../routes/constants";

export const TenantsPage = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<TenantResponse | null>(null);
  const [viewTenant, setViewTenant] = useState<TenantResponse | null>(null);
  const [deactivateTenant, setDeactivateTenant] = useState<TenantResponse | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  const onCreated = (created: CreateTenantResponse) => {
    setRevealedPassword(created.temporaryPassword);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <TenantsTable
        onCreate={() => setCreateOpen(true)}
        onView={setViewTenant}
        onEdit={setEditTenant}
        onStartSession={(tenant) => {
          const activeTenant = { id: tenant.id, name: tenant.name } as TenantResponse;
          AuthUtils.setActiveTenant(activeTenant);
          navigate(`/${ROUTE_PATHS.analytics}`);
        }}
        onDeactivate={setDeactivateTenant}
      />

      <TenantCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <TenantEditModal
        open={editTenant != null}
        tenant={editTenant}
        onClose={() => setEditTenant(null)}
      />

      <SecretRevealDialog
        open={revealedPassword != null}
        value={revealedPassword}
        onClose={() => setRevealedPassword(null)}
        title="Tenant admin temporary password"
        description="As Sentinel admin, copy this password now and share it securely with the tenant admin. It will not be shown again."
        copySuccessMessage="Temporary password copied to clipboard."
        copyErrorMessage="Could not copy temporary password."
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
