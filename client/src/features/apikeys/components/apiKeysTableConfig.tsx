import type { DataTableColumn, RowAction } from '../../../shared/ui/data-table'
import type { ServiceApiKeyResponse } from '../dto/response/apikey.response'

export const apiKeyColumns: DataTableColumn<ServiceApiKeyResponse>[] = [
  {
    id: 'name',
    header: 'Name',
    searchable: false,
    sortable: true,
    cell: { type: 'text', getValue: (row) => row.name },
  },
  {
    id: 'secret',
    header: 'Secret',
    sortable: false,
    cell: {
      type: 'custom',
      render: () => (
        <span className="font-mono tracking-widest text-muted">****</span>
      ),
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
        { label: 'Revoked', value: 'REVOKED' },
      ],
    },
    cell: {
      type: 'badge',
      getValue: (row) => row.status,
      labels: { ACTIVE: 'Active', REVOKED: 'Revoked' },
      variants: { ACTIVE: 'success', REVOKED: 'muted' },
    },
  },
  {
    id: 'createdAt',
    header: 'Created',
    sortable: true,
    cell: { type: 'datetime', getValue: (row) => row.createdAt },
  },
  {
    id: 'revokedAt',
    header: 'Revoked',
    sortable: true,
    cell: {
      type: 'datetime',
      getValue: (row) => row.revokedAt,
    },
  },
]

type ApiKeyRowActionHandlers = {
  onRevoke: (row: ServiceApiKeyResponse) => void
}

export const createApiKeyRowActions = ({
  onRevoke,
}: ApiKeyRowActionHandlers): RowAction<ServiceApiKeyResponse>[] => [
  {
    id: 'revoke',
    label: 'Revoke',
    variant: 'danger',
    hidden: (row) => row.status === 'REVOKED',
    onClick: onRevoke,
  },
]
