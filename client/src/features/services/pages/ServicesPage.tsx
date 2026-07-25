import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TENANT_CONTEXT_ROUTES } from '../../../routes/paths'
import type { ProductResponse } from '../../products/dto/response/product.response'
import type { ServiceResponse } from '../dto/response/service.response'
import { useProductsQuery } from '../../products/hooks/useProducts'
import { DeactivateServiceDialog } from '../components/DeactivateServiceDialog'
import { ServiceFormModal } from '../components/ServiceFormModal'
import { ServicesTable } from '../components/ServicesTable'
import { ServiceViewModal } from '../components/ServiceViewModal'

const EMPTY_PRODUCTS: ProductResponse[] = []

const ACTIVE_PRODUCTS_PARAMS = {
  page: 0,
  size: 100,
  status: 'ACTIVE' as const,
}

type FormState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; service: ServiceResponse }

export const ServicesPage = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<FormState>({ open: false })
  const [viewService, setViewService] = useState<ServiceResponse | null>(null)
  const [deactivateService, setDeactivateService] =
    useState<ServiceResponse | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  )

  const productsQuery = useProductsQuery(ACTIVE_PRODUCTS_PARAMS)
  const products = productsQuery.data?.content ?? EMPTY_PRODUCTS

  useEffect(() => {
    if (products.length === 0) {
      setSelectedProductId(null)
      return
    }
    setSelectedProductId((current) => {
      if (current && products.some((product) => product.id === current)) {
        return current
      }
      return products[0]!.id
    })
  }, [products])

  const activeProductId =
    formState.open && formState.mode === 'edit'
      ? formState.service.productId
      : (deactivateService?.productId ?? selectedProductId)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ServicesTable
        products={products}
        selectedProductId={selectedProductId}
        onProductChange={setSelectedProductId}
        productsLoading={productsQuery.isFetching}
        onCreate={() => setFormState({ open: true, mode: 'create' })}
        onView={setViewService}
        onEdit={(service) =>
          setFormState({ open: true, mode: 'edit', service })
        }
        onViewApiKeys={(service) =>
          navigate(
            `${TENANT_CONTEXT_ROUTES.SERVICE_API_KEYS(service.id)}?productId=${service.productId}`,
          )
        }
        onDeactivate={setDeactivateService}
      />

      <ServiceFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : 'create'}
        productId={
          formState.open && formState.mode === 'edit'
            ? formState.service.productId
            : (selectedProductId ?? undefined)
        }
        service={
          formState.open && formState.mode === 'edit' ? formState.service : null
        }
        onClose={() => setFormState({ open: false })}
      />

      <ServiceViewModal
        open={viewService != null}
        service={viewService}
        onClose={() => setViewService(null)}
      />

      <DeactivateServiceDialog
        open={deactivateService != null}
        productId={activeProductId ?? ''}
        service={deactivateService}
        onClose={() => setDeactivateService(null)}
      />
    </div>
  )
}
