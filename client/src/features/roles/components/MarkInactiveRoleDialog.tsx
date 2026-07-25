import { useId } from 'react'
import type { RoleResponse } from '../dto/response/role.response'
import { useMarkRoleInactive } from '../hooks/useRoles'

type MarkInactiveRoleDialogProps = {
  open: boolean
  role: RoleResponse | null
  onClose: () => void
}

export const MarkInactiveRoleDialog = ({
  open,
  role,
  onClose,
}: MarkInactiveRoleDialogProps) => {
  const titleId = useId()
  const inactiveMutation = useMarkRoleInactive()

  if (!open || !role) {
    return null
  }

  const onConfirm = () => {
    inactiveMutation.mutate(role.id, {
      onSuccess: () => {
        onClose()
      },
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
            Deactivate role
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
          Deactivate{' '}
          <span className="font-medium text-foreground">{role.name}</span>? It
          will no longer be assignable to users.
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
            disabled={inactiveMutation.isPending}
            className="cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inactiveMutation.isPending ? 'Deactivating…' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  )
}
