import { useLogout } from '../hooks/useLogout'
import { useAppSelector } from '../../../app/hooks'

export function HomePage() {
  const user = useAppSelector((state) => state.auth.user)
  const roles = useAppSelector((state) => state.auth.roles)
  const meStatus = useAppSelector((state) => state.auth.meStatus)
  const logoutMutation = useLogout()

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Welcome</h1>
            <p className="text-sm text-slate-600">
              {user?.displayName ?? '…'} ({user?.email ?? '…'})
            </p>
          </div>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            Log out
          </button>
        </div>

        {meStatus === 'loading' || meStatus === 'idle' ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : null}
        {meStatus === 'error' ? <p className="text-sm text-red-600">Failed to load profile</p> : null}

        {meStatus === 'ready' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-800">Roles</h2>
            <ul className="space-y-3">
              {roles.map((role) => (
                <li key={role.id} className="rounded border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{role.name}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Permissions: {role.permissions.map((p) => p.name).join(', ') || 'none'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  )
}
