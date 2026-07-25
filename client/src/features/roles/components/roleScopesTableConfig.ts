import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { RoleScopeResponse } from '../dto/response/role.response'

export const roleScopeColumns: DataTableColumn<RoleScopeResponse>[] = [
  {
    id: 'scopeType',
    header: 'Scope type',
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.scopeType },
  },
  {
    id: 'scopeName',
    header: 'Scope name',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.scopeName },
  },
  {
    id: 'scopeId',
    header: 'Scope ID',
    cell: {
      type: 'text',
      getValue: (row) => row.scopeId,
    },
  },
  {
    id: 'permission',
    header: 'Permission',
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.permission },
  },
  {
    id: 'status',
    header: 'Status',
    sortable: true,
    cell: {
      type: 'badge',
      getValue: (row) => row.status,
      labels: { ACTIVE: 'Active', INACTIVE: 'Inactive' },
      variants: { ACTIVE: 'success', INACTIVE: 'muted' },
    },
  },
]

type RoleScopeRowActionHandlers = {
  onEdit: (row: RoleScopeResponse) => void
  onDeactivate: (row: RoleScopeResponse) => void
}

export const createRoleScopeRowActions = ({
  onEdit,
  onDeactivate,
}: RoleScopeRowActionHandlers): RowAction<RoleScopeResponse>[] => [
  {
    id: 'edit',
    label: 'Edit permission',
    onClick: onEdit,
    hidden: (row) => row.status === 'INACTIVE',
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    variant: 'danger',
    hidden: (row) => row.status === 'INACTIVE',
    onClick: onDeactivate,
  },
]
