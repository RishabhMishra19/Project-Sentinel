import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { ProductResponse } from '../dto/response/product.response'

export const productColumns: DataTableColumn<ProductResponse>[] = [
  {
    id: 'name',
    header: 'Name',
    searchable: true,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.name },
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

type ProductRowActionHandlers = {
  onView: (row: ProductResponse) => void
  onEdit: (row: ProductResponse) => void
  onServices: (row: ProductResponse) => void
  onDeactivate: (row: ProductResponse) => void
}

export const createProductRowActions = ({
  onView,
  onEdit,
  onServices,
  onDeactivate,
}: ProductRowActionHandlers): RowAction<ProductResponse>[] => [
  {
    id: 'view',
    label: 'View',
    onClick: onView,
  },
  {
    id: 'services',
    label: 'Services',
    onClick: onServices,
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
