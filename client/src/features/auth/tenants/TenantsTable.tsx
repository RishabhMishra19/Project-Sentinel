import { useMemo, useState } from 'react'
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'
import type { TenantResponse } from '../dto/tenant.dto'
import { useTenantsQuery } from '../hooks/useTenants'
import { mapTenantListQuery } from './mapTenantListQuery'
import {
  createTenantRowActions,
  tenantColumns,
} from './tenantsTableConfig'

type TenantsTableProps = {
  onCreate: () => void
  onView: (tenant: TenantResponse) => void
  onEdit: (tenant: TenantResponse) => void
  onDeactivate: (tenant: TenantResponse) => void
}

export const TenantsTable = ({
  onCreate,
  onView,
  onEdit,
  onDeactivate,
}: TenantsTableProps) => {
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null)

  const listParams = useMemo(
    () => (fetchQuery ? mapTenantListQuery(fetchQuery) : null),
    [fetchQuery],
  )

  const { data, isFetching } = useTenantsQuery(listParams)

  const rowActions = useMemo(
    () =>
      createTenantRowActions({
        onView,
        onEdit,
        onDeactivate,
      }),
    [onView, onEdit, onDeactivate],
  )

  const { tableProps } = useServerDataTable({
    columns: tenantColumns,
    data: data?.content ?? [],
    getRowId: (row) => row.id,
    totalElements: data?.totalElements ?? 0,
    initialState: { pageSize: 10 },
    rowActions,
    isLoading: isFetching || fetchQuery == null,
    onQueryChange: setFetchQuery,
    toolbarActions: (
      <button
        type="button"
        className={primaryButtonClassName}
        onClick={onCreate}
      >
        Create tenant
      </button>
    ),
    emptyMessage: 'No tenants match your filters',
  })

  return <DataTable {...tableProps} />
}
