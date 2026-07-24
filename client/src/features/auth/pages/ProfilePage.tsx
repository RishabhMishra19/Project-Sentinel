import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { useProfile } from '../hooks/useProfile'

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

export function ProfilePage() {
  const { data, isLoading, isError } = useProfile()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  const user = data?.user
  const roles = data?.roles ?? []

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
            <p className="text-sm text-slate-600">Your account details</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="cursor-pointer rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => setChangePasswordOpen(true)}
              className="cursor-pointer rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
            >
              Change password
            </button>
          </div>
        </div>

        {isLoading ? <p className="text-sm text-slate-500">Loading profile…</p> : null}
        {isError ? <p className="text-sm text-red-600">Failed to load profile</p> : null}

        {user ? (
          <div className="space-y-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Display name
                </dt>
                <dd className="mt-1 text-slate-900">{user.displayName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="mt-1 text-slate-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Status
                </dt>
                <dd className="mt-1 text-slate-900">{user.status}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Created
                </dt>
                <dd className="mt-1 text-slate-900">{formatDate(user.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Updated
                </dt>
                <dd className="mt-1 text-slate-900">{formatDate(user.updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Last login
                </dt>
                <dd className="mt-1 text-slate-900">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                </dd>
              </div>
            </dl>

            <div className="space-y-3">
              <h2 className="text-lg font-medium text-slate-800">Roles</h2>
              {roles.length === 0 ? (
                <p className="text-sm text-slate-500">No roles assigned</p>
              ) : (
                <ul className="space-y-3">
                  {roles.map((role) => (
                    <li key={role.id} className="rounded border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{role.name}</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Permissions:{' '}
                        {role.permissions.map((p) => p.name).join(', ') || 'none'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </main>
  )
}
