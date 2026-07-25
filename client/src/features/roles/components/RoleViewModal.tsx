import { useId } from 'react'
import { useRoleQuery } from '../hooks/useRoles'

type RoleViewModalProps = {
  open: boolean
  roleId: string | null
  onClose: () => void
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
)

export const RoleViewModal = ({ open, roleId, onClose }: RoleViewModalProps) => {
  const titleId = useId()
  const { data: role, isFetching, isError } = useRoleQuery(roleId, open)

  if (!open || !roleId) {
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
            Role details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        {isFetching && !role ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : isError || !role ? (
          <p className="text-sm text-danger">Could not load role.</p>
        ) : (
          <dl className="flex flex-col gap-3">
            <DetailRow label="Name" value={role.name} />
            <DetailRow
              label="Status"
              value={role.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            />
            <DetailRow
              label="Created by"
              value={`${role.createdBy.name} (${role.createdBy.email})`}
            />
            <DetailRow
              label="Updated by"
              value={`${role.updatedBy.name} (${role.updatedBy.email})`}
            />
            <DetailRow label="Created" value={formatDateTime(role.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(role.updatedAt)} />
          </dl>
        )}

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
