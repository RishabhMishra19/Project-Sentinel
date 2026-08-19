import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
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
  const edit = useModalState<TenantResponse>();
  const view = useModalState<TenantResponse>();
  const deactivate = useModalState<TenantResponse>();
  const revealedPassword = useModalState<string>();

  const onCreated = (created: CreateTenantResponse) => {
    revealedPassword.show(created.temporaryPassword);
  };

  return (
    <>
      <TenantsTable
        onCreate={() => setCreateOpen(true)}
        onView={view.show}
        onEdit={edit.show}
        onStartSession={(tenant) => {
          const activeTenant = { id: tenant.id, name: tenant.name } as TenantResponse;
          AuthUtils.setActiveTenant(activeTenant);
          navigate(`/${ROUTE_PATHS.analytics}`);
        }}
        onDeactivate={deactivate.show}
      />

      <TenantCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <TenantEditModal open={edit.open} tenant={edit.item} onClose={edit.close} />

      <SecretRevealDialog
        open={revealedPassword.open}
        value={revealedPassword.item}
        onClose={revealedPassword.close}
        title="Tenant admin temporary password"
        description="As Sentinel admin, copy this password now and share it securely with the tenant admin. It will not be shown again."
        copySuccessMessage="Temporary password copied to clipboard."
        copyErrorMessage="Could not copy temporary password."
      />

      <TenantViewModal open={view.open} tenant={view.item} onClose={view.close} />

      <DeactivateTenantDialog
        open={deactivate.open}
        tenant={deactivate.item}
        onClose={deactivate.close}
      />
    </>
  );
};
