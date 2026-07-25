import { useId } from 'react'
import { getApiErrorMessage } from '../../../shared/forms/getApiErrorMessage'
import { toast } from '../../../shared/ui/toast'
import type { TenantResponse } from '../dto/response/tenant.response'
import { useDeleteTenant } from '../hooks/useTenants'

type DeactivateTenantDialogProps = {
  open: boolean
  tenant: TenantResponse | null
  onClose: () => void
}

export const DeactivateTenantDialog = ({
  open,
  tenant,
  onClose,
}: DeactivateTenantDialogProps) => {
  const titleId = useId()
  const deleteMutation = useDeleteTenant()

  if (!open || !tenant) {
    return null
  }

  const onConfirm = () => {
    toast.promise(deleteMutation.mutateAsync(tenant.id), {
      loading: 'Deactivating tenant…',
      success: () => {
        onClose()
        return 'Tenant deactivated.'
      },
      error: (error) =>
        getApiErrorMessage(
          error,
          'Could not deactivate tenant. Please try again.',
        ),
    })
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
            Deactivate tenant
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <p className="text-sm text-muted">
          Deactivate <span className="font-medium text-foreground">{tenant.name}</span>
          ? The tenant will be marked inactive. This can be filtered later, but
          there is no restore action yet.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleteMutation.isPending}
            className="cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending ? 'Deactivating…' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  )
}
