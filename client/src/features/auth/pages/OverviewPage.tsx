import { useState } from 'react'
import { useAppSelector } from '../../../app/hooks'
import { buttonClassName } from '../../../shared/ui/data-table/styles'
import { ClientTenantsTable } from '../tenants/ClientTenantsTable'
import { ServerTenantsTable } from '../tenants/ServerTenantsTable'

type TableMode = 'client' | 'server'

export const OverviewPage = () => {
  const user = useAppSelector((state) => state.auth.user)
  const roles = useAppSelector((state) => state.auth.roles)
  const tenant = useAppSelector((state) => state.auth.tenant)
  const meStatus = useAppSelector((state) => state.auth.meStatus)
  const [mode, setMode] = useState<TableMode>('client')

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-sm text-muted">
            {user?.displayName ?? '…'} ({user?.email ?? '…'})
          </p>
          {meStatus === 'ready' ? (
            <>
              <p className="mt-1 text-sm text-muted">
                Sentinel admin: {user?.sentinelAdmin ? 'Yes' : 'No'}
              </p>
              <p className="mt-1 text-sm text-muted">
                Tenant: {tenant ? `${tenant.name} (${tenant.id})` : 'No tenant'}
              </p>
            </>
          ) : null}
        </div>

        {meStatus === 'loading' || meStatus === 'idle' ? (
          <p className="text-sm text-muted">Loading profile…</p>
        ) : null}
        {meStatus === 'error' ? (
          <p className="text-sm text-danger">Failed to load profile</p>
        ) : null}

        {meStatus === 'ready' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Roles</h2>
            <ul className="space-y-3">
              {roles.map((role) => (
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
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              DataTable demo
            </h2>
            <p className="mt-1 text-xs text-muted">
              {mode === 'client'
                ? 'Client mode: loads all rows once, then filters/sorts/pages in the browser.'
                : 'Server mode: each query hits a dummy API (search is debounced).'}
            </p>
          </div>

          <div className="inline-flex overflow-hidden rounded border border-border">
            <button
              type="button"
              className={`${buttonClassName} rounded-none border-0 ${
                mode === 'client' ? 'bg-accent-soft text-accent' : ''
              }`}
              onClick={() => setMode('client')}
            >
              Client hook
            </button>
            <button
              type="button"
              className={`${buttonClassName} rounded-none border-0 border-l border-border ${
                mode === 'server' ? 'bg-accent-soft text-accent' : ''
              }`}
              onClick={() => setMode('server')}
            >
              Server hook
            </button>
          </div>
        </div>

        {mode === 'client' ? <ClientTenantsTable /> : <ServerTenantsTable />}
      </div>
    </div>
  )
}
