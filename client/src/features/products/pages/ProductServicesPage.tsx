import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TENANT_CONTEXT_ROUTES } from '../../../routes/paths'
import type { ServiceResponse } from '../../services/dto/response/service.response'
import { DeactivateServiceDialog } from '../../services/components/DeactivateServiceDialog'
import { ServiceFormModal } from '../../services/components/ServiceFormModal'
import { ServicesTable } from '../../services/components/ServicesTable'
import { ServiceViewModal } from '../../services/components/ServiceViewModal'

type FormState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; service: ServiceResponse }

export const ProductServicesPage = () => {
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()
  const [formState, setFormState] = useState<FormState>({ open: false })
  const [viewService, setViewService] = useState<ServiceResponse | null>(null)
  const [deactivateService, setDeactivateService] =
    useState<ServiceResponse | null>(null)

  if (!productId) {
    return (
      <div className="mx-auto w-full max-w-6xl text-sm text-muted">
        Product not found.{' '}
        <Link
          to={TENANT_CONTEXT_ROUTES.PRODUCTS}
          className="text-accent underline"
        >
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ServicesTable
        productId={productId}
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
        productId={productId}
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
        productId={productId}
        service={deactivateService}
        onClose={() => setDeactivateService(null)}
      />
    </div>
  )
}
