import { useId } from 'react'
import type { UserResponse } from '../dto/response/user.response'

type UserViewModalProps = {
  open: boolean
  user: UserResponse | null
  onClose: () => void
}

const formatDateTime = (value: string | null) => {
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

export const UserViewModal = ({ open, user, onClose }: UserViewModalProps) => {
  const titleId = useId()

  if (!open || !user) {
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
            User details
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
          <DetailRow label="Display name" value={user.displayName} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow
            label="Tenant admin"
            value={user.tenantAdmin ? 'Yes' : 'No'}
          />
          <DetailRow
            label="Status"
            value={user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          />
          <DetailRow
            label="Roles"
            value={
              user.roles.length > 0
                ? user.roles.map((role) => role.name).join(', ')
                : 'None'
            }
          />
          <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
          <DetailRow
            label="Last login"
            value={formatDateTime(user.lastLoginAt)}
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
