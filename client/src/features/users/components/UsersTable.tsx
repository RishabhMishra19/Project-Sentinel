import { useMemo, useState } from "react";
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { UserResponse } from "../dto/response/user.response";
import { useUsersQuery } from "../hooks/useUsers";
import { mapUserListQuery } from "../utils/mapUserListQuery";
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
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null);

  const listParams = useMemo(
    () => (fetchQuery ? mapUserListQuery(fetchQuery) : null),
    [fetchQuery],
  );

  const { data, isFetching, isError } = useUsersQuery(listParams);

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

  const { tableProps } = useServerDataTable({
    columns: userColumns,
    data: data?.content ?? [],
    getRowId: (row) => row.id,
    totalElements: data?.totalElements ?? 0,
    initialState: { pageSize: 10 },
    rowActions,
    isLoading: isFetching || fetchQuery == null,
    onQueryChange: setFetchQuery,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create user
      </button>
    ),
    emptyMessage: isError ? "Could not load users" : "No users match your filters",
  });

  return <DataTable {...tableProps} />;
};
