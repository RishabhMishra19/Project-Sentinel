import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { RoleResponse } from "../dto/response/role.response";
import { useRolesQuery } from "../hooks/useRoles";
import { createRoleRowActions, roleColumns } from "./rolesTableConfig";

type RolesTableProps = {
  onCreate: () => void;
  onView: (role: RoleResponse) => void;
  onEdit: (role: RoleResponse) => void;
  onShowScopes: (role: RoleResponse) => void;
  onMarkInactive: (role: RoleResponse) => void;
};

export const RolesTable = ({
  onCreate,
  onView,
  onEdit,
  onShowScopes,
  onMarkInactive,
}: RolesTableProps) => {
  const { rows, isLoading, isError } = useRolesQuery();

  const rowActions = useMemo(
    () =>
      createRoleRowActions({
        onView,
        onEdit,
        onShowScopes,
        onMarkInactive,
      }),
    [onView, onEdit, onShowScopes, onMarkInactive],
  );

  const { bindPage, toLocalPage } = useDataTable({
    columns: roleColumns,
    getRowId: (row) => row.id,
    enablePagination: false,
    isLoading,
    isError,
    rowActions,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create role
      </button>
    ),
    emptyMessage: "No roles found",
    errorMessage: "Could not load roles",
  });

  return <DataTable {...bindPage(toLocalPage(rows))} />;
};
