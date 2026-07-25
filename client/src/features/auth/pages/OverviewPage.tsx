import { useAppSelector } from '../../../redux/hooks'

export const OverviewPage = () => {
  const user = useAppSelector((state) => state.session.user)
  const activeTenant = useAppSelector((state) => state.session.activeTenant)


  if (!user) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-8">
        <p className="text-sm text-muted">Loading profile…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-8">
      <div className="mb-6">
        <p className="text-sm text-muted">
          {user.name} ({user.email})
        </p>
        <p className="mt-1 text-sm text-muted">
          Sentinel admin: {user.sentinelAdmin ? 'Yes' : 'No'}
        </p>
        <p className="mt-1 text-sm text-muted">
          Active tenant: {activeTenant ? `${activeTenant.name} (${activeTenant.id})` : 'None'}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Roles</h2>
        <ul className="space-y-3">
          {user.roles.map((role) => (
            <li key={role.id} className="rounded border border-border p-4">
              <p className="font-medium text-foreground">{role.name}</p>
              <p className="mt-2 text-sm text-muted">
                Scopes:{' '}
                {role.scopes
                  .map(
                    (s) =>
                      `${s.scopeType}${s.scopeId ? `:${s.scopeId.slice(0, 8)}` : ''} (${s.permission})`,
                  )
                  .join(', ') || 'none'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
