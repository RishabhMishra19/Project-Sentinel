import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { UserResponse } from "../dto/response/user.response";
import { useUsersQuery } from "../hooks/useUsers";
import { createUserRowActions, userColumns } from "./usersTableConfig";

type UsersTableProps = {
  onCreate: () => void;
  onView: (user: UserResponse) => void;
  onEdit: (user: UserResponse) => void;
  onAssignRole: (user: UserResponse) => void;
  onMarkInactive: (user: UserResponse) => void;
};

export const UsersTable = ({
  onCreate,
  onView,
  onEdit,
  onAssignRole,
  onMarkInactive,
}: UsersTableProps) => {
  const rowActions = useMemo(
    () =>
      createUserRowActions({
        onView,
        onEdit,
        onAssignRole,
        onMarkInactive,
      }),
    [onView, onEdit, onAssignRole, onMarkInactive],
  );

  const { listQueryRequest, bindPage } = useDataTable({
    columns: userColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create user
      </button>
    ),
    emptyMessage: "No users match your filters",
    errorMessage: "Could not load users",
  });

  const page = useUsersQuery(listQueryRequest);

  return <DataTable {...bindPage(page)} />;
};
