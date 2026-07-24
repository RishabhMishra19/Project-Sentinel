import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  DataTable,
  useClientDataTable,
} from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'
import { listAllDummyTenants } from './dummyTenantsApi'
import {
  createTenantRowActions,
  tenantColumns,
} from './tenantsTableConfig'

export const ClientTenantsTable = () => {
  const rowActions = useMemo(() => createTenantRowActions(), [])

  const { data = [], isFetching } = useQuery({
    queryKey: ['dummy-tenants', 'all'],
    queryFn: listAllDummyTenants,
  })

  const { tableProps } = useClientDataTable({
    columns: tenantColumns,
    data,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    isLoading: isFetching,
    toolbarActions: (
      <button
        type="button"
        className={primaryButtonClassName}
        onClick={() => console.info('Create tenant')}
      >
        Create tenant
      </button>
    ),
    emptyMessage: 'No tenants match your filters',
  })

  return <DataTable {...tableProps} />
}
