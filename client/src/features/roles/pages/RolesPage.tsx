import { useState } from "react";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
import type { RoleResponse } from "../dto/response/role.response";
import { MarkInactiveRoleDialog } from "../components/MarkInactiveRoleDialog";
import { RoleCreateModal } from "../components/RoleCreateModal";
import { RoleEditModal } from "../components/RoleEditModal";
import { RoleScopesModal } from "../components/RoleScopesModal";
import { RoleViewModal } from "../components/RoleViewModal";
import { RolesTable } from "../components/RolesTable";

export const RolesPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const viewRoleId = useModalState<string>();
  const edit = useModalState<RoleResponse>();
  const scopes = useModalState<RoleResponse>();
  const inactive = useModalState<RoleResponse>();

  return (
    <PageContent>
      <RolesTable
        onCreate={() => setCreateOpen(true)}
        onView={(role) => viewRoleId.show(role.id)}
        onEdit={edit.show}
        onShowScopes={scopes.show}
        onMarkInactive={inactive.show}
      />

      <RoleCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <RoleViewModal open={viewRoleId.open} roleId={viewRoleId.item} onClose={viewRoleId.close} />

      <RoleEditModal open={edit.open} role={edit.item} onClose={edit.close} />

      <RoleScopesModal open={scopes.open} role={scopes.item} onClose={scopes.close} />

      <MarkInactiveRoleDialog open={inactive.open} role={inactive.item} onClose={inactive.close} />
    </PageContent>
  );
};
