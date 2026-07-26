import type { DataTableColumn, RowAction } from "../../../shared/ui/data-table";
import type { RoleResponse } from "../dto/response/role.response";

export const roleColumns: DataTableColumn<RoleResponse>[] = [
  {
    id: "name",
    header: "Name",
    searchable: true,
    sortable: true,
    cell: { type: "text", getValue: (row) => row.name },
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
    id: "createdBy",
    header: "Created by",
    cell: {
      type: "text",
      getValue: (row) => row.createdBy.name,
    },
  },
  {
    id: "updatedBy",
    header: "Updated by",
    cell: {
      type: "text",
      getValue: (row) => row.updatedBy.name,
    },
  },
  {
    id: "createdAt",
    header: "Created",
    sortable: true,
    cell: { type: "datetime", getValue: (row) => row.createdAt },
  },
  {
    id: "updatedAt",
    header: "Updated",
    sortable: true,
    cell: { type: "datetime", getValue: (row) => row.updatedAt },
  },
];

type RoleRowActionHandlers = {
  onView: (row: RoleResponse) => void;
  onEdit: (row: RoleResponse) => void;
  onShowScopes: (row: RoleResponse) => void;
  onMarkInactive: (row: RoleResponse) => void;
};

export const createRoleRowActions = ({
  onView,
  onEdit,
  onShowScopes,
  onMarkInactive,
}: RoleRowActionHandlers): RowAction<RoleResponse>[] => [
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
    id: "show-scopes",
    label: "Show Scopes",
    onClick: onShowScopes,
  },
  {
    id: "mark-inactive",
    label: "Deactivate",
    variant: "danger",
    hidden: (row) => row.status === "INACTIVE",
    onClick: onMarkInactive,
  },
];
