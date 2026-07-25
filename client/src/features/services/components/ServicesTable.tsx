import { useMemo, useState } from 'react'
import {
  DataTable,
  useServerDataTable,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import {
  inputClassName,
  primaryButtonClassName,
} from '../../../shared/ui/data-table/styles'
import type { ProductResponse } from '../../products/dto/response/product.response'
import type { ServiceResponse } from '../dto/response/service.response'
import { useServicesQuery } from '../hooks/useServices'
import { mapServiceListQuery } from '../utils/mapServiceListQuery'
import {
  createServiceRowActions,
  productServiceColumns,
} from './servicesTableConfig'

type ServicesTableProps = {
  /** Fixed product (e.g. nested product services page). */
  productId?: string
  /** Products for the toolbar selector on the Services tab. */
  products?: ProductResponse[]
  selectedProductId?: string | null
  onProductChange?: (productId: string) => void
  productsLoading?: boolean
  onCreate: () => void
  onView: (service: ServiceResponse) => void
  onEdit: (service: ServiceResponse) => void
  onDeactivate: (service: ServiceResponse) => void
}

export const ServicesTable = ({
  productId,
  products,
  selectedProductId,
  onProductChange,
  productsLoading = false,
  onCreate,
  onView,
  onEdit,
  onDeactivate,
}: ServicesTableProps) => {
  const effectiveProductId = productId ?? selectedProductId ?? undefined

  return (
    <ServicesTableInner
      key={effectiveProductId ?? 'no-product'}
      effectiveProductId={effectiveProductId}
      products={products}
      selectedProductId={selectedProductId}
      onProductChange={onProductChange}
      productsLoading={productsLoading}
      onCreate={onCreate}
      onView={onView}
      onEdit={onEdit}
      onDeactivate={onDeactivate}
    />
  )
}

type ServicesTableInnerProps = {
  effectiveProductId?: string
  products?: ProductResponse[]
  selectedProductId?: string | null
  onProductChange?: (productId: string) => void
  productsLoading: boolean
  onCreate: () => void
  onView: (service: ServiceResponse) => void
  onEdit: (service: ServiceResponse) => void
  onDeactivate: (service: ServiceResponse) => void
}

const ServicesTableInner = ({
  effectiveProductId,
  products,
  selectedProductId,
  onProductChange,
  productsLoading,
  onCreate,
  onView,
  onEdit,
  onDeactivate,
}: ServicesTableInnerProps) => {
  const [fetchQuery, setFetchQuery] = useState<DataTableQueryState | null>(null)
  const showProductSelect = products != null && onProductChange != null

  const listParams = useMemo(
    () => (fetchQuery ? mapServiceListQuery(fetchQuery) : null),
    [fetchQuery],
  )

  const { data, isFetching } = useServicesQuery(
    effectiveProductId,
    effectiveProductId ? listParams : null,
  )

  const rowActions = useMemo(
    () =>
      createServiceRowActions({
        onView,
        onEdit,
        onDeactivate,
      }),
    [onView, onEdit, onDeactivate],
  )

  const emptyMessage = !effectiveProductId
    ? productsLoading
      ? 'Loading products…'
      : products && products.length === 0
        ? 'Create a product before managing services'
        : 'Select a product to view its services'
    : 'No services match your filters'

  const { tableProps } = useServerDataTable({
    columns: productServiceColumns,
    data: effectiveProductId ? (data?.content ?? []) : [],
    getRowId: (row) => row.id,
    totalElements: effectiveProductId ? (data?.totalElements ?? 0) : 0,
    initialState: { pageSize: 10 },
    rowActions: effectiveProductId ? rowActions : [],
    isLoading:
      productsLoading ||
      (effectiveProductId != null && (isFetching || fetchQuery == null)),
    onQueryChange: setFetchQuery,
    toolbarActions: (
      <div className="flex flex-wrap items-center gap-2">
        {showProductSelect ? (
          <select
            className={`${inputClassName} min-w-[10rem]`}
            value={selectedProductId ?? ''}
            disabled={productsLoading || (products?.length ?? 0) === 0}
            onChange={(event) => onProductChange(event.target.value)}
            aria-label="Filter services by product"
          >
            {(products?.length ?? 0) === 0 ? (
              <option value="">No products</option>
            ) : (
              products!.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))
            )}
          </select>
        ) : null}
        <button
          type="button"
          className={primaryButtonClassName}
          onClick={onCreate}
          disabled={!effectiveProductId}
        >
          Create service
        </button>
      </div>
    ),
    emptyMessage,
  })

  return <DataTable {...tableProps} />
}
