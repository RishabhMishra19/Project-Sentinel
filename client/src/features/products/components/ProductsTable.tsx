import { useMemo, useState } from 'react'
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'
import type { ProductResponse } from '../dto/response/product.response'
import { useProductsQuery } from '../hooks/useProducts'
import { mapProductListQuery } from '../utils/mapProductListQuery'
import {
  createProductRowActions,
  productColumns,
} from './productsTableConfig'

type ProductsTableProps = {
  onCreate: () => void
  onView: (product: ProductResponse) => void
  onEdit: (product: ProductResponse) => void
  onServices: (product: ProductResponse) => void
  onDeactivate: (product: ProductResponse) => void
}

export const ProductsTable = ({
  onCreate,
  onView,
  onEdit,
  onServices,
  onDeactivate,
}: ProductsTableProps) => {
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null)

  const listParams = useMemo(
    () => (fetchQuery ? mapProductListQuery(fetchQuery) : null),
    [fetchQuery],
  )

  const { data, isFetching } = useProductsQuery(listParams)

  const rowActions = useMemo(
    () =>
      createProductRowActions({
        onView,
        onEdit,
        onServices,
        onDeactivate,
      }),
    [onView, onEdit, onServices, onDeactivate],
  )

  const { tableProps } = useServerDataTable({
    columns: productColumns,
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
        Create product
      </button>
    ),
    emptyMessage: 'No products match your filters',
  })

  return <DataTable {...tableProps} />
}
