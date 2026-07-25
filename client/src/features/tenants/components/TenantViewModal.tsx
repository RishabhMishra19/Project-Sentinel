import { useId } from 'react'
import type { TenantResponse } from '../dto/response/tenant.response'

type TenantViewModalProps = {
  open: boolean
  tenant: TenantResponse | null
  onClose: () => void
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

const DetailRow = ({
  label,
  value,
}: {
  label: string
  value: string
}) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
)

export const TenantViewModal = ({
  open,
  tenant,
  onClose,
}: TenantViewModalProps) => {
  const titleId = useId()

  if (!open || !tenant) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">
            Tenant details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <dl className="flex flex-col gap-3">
          <DetailRow label="Name" value={tenant.name} />
          <DetailRow label="Slug" value={tenant.slug} />
          <DetailRow
            label="Admins"
            value={
              tenant.adminEmails.length > 0
                ? tenant.adminEmails.join(', ')
                : '—'
            }
          />
          <DetailRow
            label="Status"
            value={tenant.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          />
          <DetailRow label="Created" value={formatDateTime(tenant.createdAt)} />
          <DetailRow
            label="Created by"
            value={`${tenant.createdBy.name} (${tenant.createdBy.email})`}
          />
          <DetailRow label="Updated" value={formatDateTime(tenant.updatedAt)} />
          <DetailRow
            label="Updated by"
            value={`${tenant.updatedBy.name} (${tenant.updatedBy.email})`}
          />
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
