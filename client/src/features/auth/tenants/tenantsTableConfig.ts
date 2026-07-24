import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { DummyTenant } from './dummyTenantsData'

export const tenantColumns: DataTableColumn<DummyTenant>[] = [
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

export const createTenantRowActions = (): RowAction<DummyTenant>[] => [
  {
    id: 'view',
    label: 'View',
    onClick: (row) => {
      console.info('View tenant', row.id)
    },
  },
  {
    id: 'edit',
    label: 'Edit',
    onClick: (row) => {
      console.info('Edit tenant', row.id)
    },
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    variant: 'danger',
    hidden: (row) => row.status === 'INACTIVE',
    onClick: (row) => {
      console.info('Deactivate tenant', row.id)
    },
  },
]
