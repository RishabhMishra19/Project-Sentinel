import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { ServiceResponse } from '../dto/response/service.response'

export const serviceColumns: DataTableColumn<ServiceResponse>[] = [
  {
    id: 'name',
    header: 'Name',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.name },
  },
  {
    id: 'productName',
    header: 'Product',
    sortable: false,
    cell: { type: 'text', getValue: (row) => row.productName },
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

/** Columns for product-scoped services table (no product column). */
export const productServiceColumns: DataTableColumn<ServiceResponse>[] =
  serviceColumns.filter((column) => column.id !== 'productName')

type ServiceRowActionHandlers = {
  onView: (row: ServiceResponse) => void
  onEdit: (row: ServiceResponse) => void
  onDeactivate: (row: ServiceResponse) => void
}

export const createServiceRowActions = ({
  onView,
  onEdit,
  onDeactivate,
}: ServiceRowActionHandlers): RowAction<ServiceResponse>[] => [
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
    id: 'deactivate',
    label: 'Deactivate',
    variant: 'danger',
    hidden: (row) => row.status === 'INACTIVE',
    onClick: onDeactivate,
  },
]
