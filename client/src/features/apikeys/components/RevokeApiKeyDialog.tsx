import { useId } from 'react'
import { getApiErrorMessage } from '../../../shared/forms/getApiErrorMessage'
import { toast } from '../../../shared/ui/toast'
import type { ServiceApiKeyResponse } from '../dto/response/apikey.response'
import { useRevokeServiceApiKey } from '../hooks/useApiKeys'

type RevokeApiKeyDialogProps = {
  open: boolean
  productId: string
  serviceId: string
  apiKey: ServiceApiKeyResponse | null
  onClose: () => void
}

export const RevokeApiKeyDialog = ({
  open,
  productId,
  serviceId,
  apiKey,
  onClose,
}: RevokeApiKeyDialogProps) => {
  const titleId = useId()
  const revokeMutation = useRevokeServiceApiKey(productId, serviceId)

  if (!open || !apiKey) {
    return null
  }

  const onConfirm = () => {
    toast.promise(revokeMutation.mutateAsync(apiKey.id), {
      loading: 'Revoking API key…',
      success: () => {
        onClose()
        return 'API key revoked.'
      },
      error: (error) =>
        getApiErrorMessage(
          error,
          'Could not revoke API key. Please try again.',
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
            Revoke API key
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
          Revoke{' '}
          <span className="font-medium text-foreground">{apiKey.name}</span>?
          This cannot be undone. Agents using this key will stop authenticating
          until you create a new key.
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
            disabled={revokeMutation.isPending}
            className="cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {revokeMutation.isPending ? 'Revoking…' : 'Revoke'}
          </button>
        </div>
      </div>
    </div>
  )
}
