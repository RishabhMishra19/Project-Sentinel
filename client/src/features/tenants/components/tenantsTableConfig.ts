import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { TenantResponse } from '../dto/response/tenant.response'

export const tenantColumns: DataTableColumn<TenantResponse>[] = [
  {
    id: 'name',
    header: 'Name',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.name },
  },
  {
    id: 'slug',
    header: 'Slug',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.slug },
  },
  {
    id: 'adminEmails',
    header: 'Admins',
    cell: {
      type: 'text',
      getValue: (row) =>
        row.adminEmails.length > 0 ? row.adminEmails.join(', ') : '—',
    },
  },
  {
    id: 'status',
    header: 'Status',
    sortable: true,
    filter: {
      type: 'select',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
      ],
    },
    cell: {
      type: 'badge',
      getValue: (row) => row.status,
      labels: { ACTIVE: 'Active', INACTIVE: 'Inactive' },
      variants: { ACTIVE: 'success', INACTIVE: 'muted' },
    },
  },
  {
    id: 'createdAt',
    header: 'Created',
    sortable: true,
    filter: { type: 'dateRange' },
    cell: { type: 'datetime', getValue: (row) => row.createdAt },
  },
]

type TenantRowActionHandlers = {
  onView: (row: TenantResponse) => void
  onEdit: (row: TenantResponse) => void
  onStartSession: (row: TenantResponse) => void
  onDeactivate: (row: TenantResponse) => void
}

export const createTenantRowActions = ({
  onView,
  onEdit,
  onStartSession,
  onDeactivate,
}: TenantRowActionHandlers): RowAction<TenantResponse>[] => [
  {
    id: 'view',
    label: 'View',
    onClick: onView,
  },
  {
    id: 'edit',
    label: 'Edit',
    onClick: onEdit,
  },
  {
    id: 'start-session',
    label: 'Start session',
    hidden: (row) => row.status === 'INACTIVE',
    onClick: onStartSession,
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    variant: 'danger',
    hidden: (row) => row.status === 'INACTIVE',
    onClick: onDeactivate,
  },
]
