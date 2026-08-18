import type { DataTableColumn, RowAction } from "../../../shared/ui/data-table";
import type { UserResponse } from "../dto/response/user.response";

export const userColumns: DataTableColumn<UserResponse>[] = [
  {
    id: "displayName",
    header: "Name",
    searchable: true,
    sortable: true,
    cell: { type: "text", getValue: (row) => row.displayName },
  },
  {
    id: "email",
    header: "Email",
    searchable: true,
    sortable: true,
    cell: { type: "text", getValue: (row) => row.email },
  },
  {
    id: "tenantAdmin",
    header: "Tenant admin",
    cell: {
      type: "badge",
      getValue: (row) => (row.tenantAdmin ? "YES" : "NO"),
      labels: { YES: "Yes", NO: "No" },
      variants: { YES: "success", NO: "muted" },
    },
  },
  {
    id: "roles",
    header: "Roles",
    cell: {
      type: "text",
      getValue: (row) =>
        row.roles.length > 0 ? row.roles.map((role) => role.name).join(", ") : "—",
    },
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    filter: {
      type: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
    cell: {
      type: "badge",
      getValue: (row) => row.status,
      labels: { ACTIVE: "Active", INACTIVE: "Inactive" },
      variants: { ACTIVE: "success", INACTIVE: "muted" },
    },
  },
  {
    id: "createdAt",
    header: "Created",
    sortable: true,
    filter: {
      type: "dateRange",
      fromKey: "from",
      toKey: "to",
    },
    cell: { type: "datetime", getValue: (row) => row.createdAt },
  },
];

type UserRowActionHandlers = {
  onView: (row: UserResponse) => void;
  onEdit: (row: UserResponse) => void;
  onAssignRole: (row: UserResponse) => void;
  onMarkInactive: (row: UserResponse) => void;
};

export const createUserRowActions = ({
  onView,
  onEdit,
  onAssignRole,
  onMarkInactive,
}: UserRowActionHandlers): RowAction<UserResponse>[] => [
  {
    id: "view",
    label: "View",
    onClick: onView,
  },
  {
    id: "edit",
    label: "Edit",
    onClick: onEdit,
    hidden: (row) => row.status === "INACTIVE",
  },
  {
    id: "assignRole",
    label: "Assign role",
    onClick: onAssignRole,
    hidden: (row) => row.status === "INACTIVE",
  },
  {
    id: "markInactive",
    label: "Mark inactive",
    variant: "danger",
    hidden: (row) => row.status === "INACTIVE",
    onClick: onMarkInactive,
  },
];
