import { useMemo } from "react";
import { DataTable, useClientDataTable } from "../../../shared/ui/data-table";
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
  const { data: roles = [], isFetching, isError } = useRolesQuery();

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

  const { tableProps } = useClientDataTable({
    columns: roleColumns,
    data: roles,
    getRowId: (row) => row.id,
    enablePagination: false,
    rowActions,
    isLoading: isFetching,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create role
      </button>
    ),
    emptyMessage: isError ? "Could not load roles" : "No roles found",
  });

  return <DataTable {...tableProps} />;
};
