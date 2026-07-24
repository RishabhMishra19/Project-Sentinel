import { useAppSelector } from '../../../app/hooks'

export function OverviewPage() {
  const user = useAppSelector((state) => state.auth.user)
  const roles = useAppSelector((state) => state.auth.roles)
  const meStatus = useAppSelector((state) => state.auth.meStatus)

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-muted">
          {user?.displayName ?? '…'} ({user?.email ?? '…'})
        </p>
      </div>

      {meStatus === 'loading' || meStatus === 'idle' ? (
        <p className="text-sm text-muted">Loading profile…</p>
      ) : null}
      {meStatus === 'error' ? <p className="text-sm text-danger">Failed to load profile</p> : null}

      {meStatus === 'ready' ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Roles</h2>
          <ul className="space-y-3">
            {roles.map((role) => (
              <li key={role.id} className="rounded border border-border p-4">
                <p className="font-medium text-foreground">{role.name}</p>
                <p className="mt-2 text-sm text-muted">
                  Permissions: {role.permissions.map((p) => p.name).join(', ') || 'none'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
