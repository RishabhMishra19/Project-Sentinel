import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'
import { listDummyTenants } from './dummyTenantsApi'
import {
  createTenantRowActions,
  tenantColumns,
} from './tenantsTableConfig'

export const ServerTenantsTable = () => {
  const rowActions = useMemo(() => createTenantRowActions(), [])
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null)

  const { data, isFetching, isPending } = useQuery({
    queryKey: ['dummy-tenants', 'page', fetchQuery],
    queryFn: () => listDummyTenants(fetchQuery!),
    enabled: fetchQuery != null,
    placeholderData: keepPreviousData,
  })

  const pageSize = fetchQuery?.pageSize ?? 10
  const pageCount = data
    ? Math.max(1, Math.ceil(data.totalElements / Math.max(pageSize, 1)))
    : 1

  const { tableProps } = useServerDataTable({
    columns: tenantColumns,
    data: data?.content ?? [],
    getRowId: (row) => row.id,
    pageCount,
    totalElements: data?.totalElements ?? 0,
    initialState: { pageSize: 10 },
    rowActions,
    isLoading: isPending || isFetching,
    onQueryChange: setFetchQuery,
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
