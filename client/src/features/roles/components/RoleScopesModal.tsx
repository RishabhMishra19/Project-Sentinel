import { useEffect, useMemo, useState } from "react";
import { ModalLayout } from "../../../shared/ui";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { RoleResponse, RoleScopeResponse } from "../dto/response/role.response";
import { useRoleScopesQuery } from "../hooks/useRoles";
import { DeactivateRoleScopeDialog } from "./DeactivateRoleScopeDialog";
import { RoleScopeCreateModal } from "./RoleScopeCreateModal";
import { RoleScopeEditModal } from "./RoleScopeEditModal";
import { createRoleScopeRowActions, roleScopeColumns } from "./roleScopesTableConfig";

type RoleScopesModalProps = {
  open: boolean;
  role: RoleResponse;
  onClose: () => void;
};

export const RoleScopesModal = ({ open, role, onClose }: RoleScopesModalProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editScope, setEditScope] = useState<RoleScopeResponse | null>(null);
  const [deactivateScope, setDeactivateScope] = useState<RoleScopeResponse | null>(null);
  const {
    rows: scopes,
    isLoading,
    isError,
  } = useRoleScopesQuery(role?.id ?? null, open && role != null);

  useEffect(() => {
    if (!open) {
      setCreateOpen(false);
      setEditScope(null);
      setDeactivateScope(null);
    }
  }, [open]);

  const rowActions = useMemo(
    () =>
      createRoleScopeRowActions({
        onEdit: setEditScope,
        onDeactivate: setDeactivateScope,
      }),
    [],
  );

  const { bindPage, toLocalPage } = useDataTable({
    columns: roleScopeColumns,
    getRowId: (row) => row.id,
    enablePagination: true,
    initialState: { pageSize: 10 },
    isLoading,
    isError,
    rowActions,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={() => setCreateOpen(true)}>
        Create scope
      </button>
    ),
    emptyMessage: "No scopes for this role",
    errorMessage: "Could not load scopes",
  });

  return (
    <>
      <ModalLayout
        open={open}
        onClose={onClose}
        title="Scopes"
        description={
          <>
            Scopes for role <span className="font-medium text-foreground">{role.name}</span>
          </>
        }
        size="4xl"
        className="flex max-h-[90vh] flex-col overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-auto">
          <DataTable {...bindPage(toLocalPage(scopes))} />
        </div>
      </ModalLayout>

      <RoleScopeCreateModal open={createOpen} role={role} onClose={() => setCreateOpen(false)} />

      <RoleScopeEditModal
        open={editScope != null}
        roleId={role.id}
        scope={editScope}
        onClose={() => setEditScope(null)}
      />

      <DeactivateRoleScopeDialog
        open={deactivateScope != null}
        roleId={role.id}
        scope={deactivateScope}
        onClose={() => setDeactivateScope(null)}
      />
    </>
  );
};
