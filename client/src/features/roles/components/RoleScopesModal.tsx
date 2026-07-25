import { useEffect, useId, useMemo, useState } from 'react'
import { DataTable, useClientDataTable } from '../../../shared/ui/data-table'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'
import type {
  RoleResponse,
  RoleScopeResponse,
} from '../dto/response/role.response'
import { useRoleScopesQuery } from '../hooks/useRoles'
import { DeactivateRoleScopeDialog } from './DeactivateRoleScopeDialog'
import { RoleScopeCreateModal } from './RoleScopeCreateModal'
import { RoleScopeEditModal } from './RoleScopeEditModal'
import {
  createRoleScopeRowActions,
  roleScopeColumns,
} from './roleScopesTableConfig'

type RoleScopesModalProps = {
  open: boolean
  role: RoleResponse | null
  onClose: () => void
}

export const RoleScopesModal = ({
  open,
  role,
  onClose,
}: RoleScopesModalProps) => {
  const titleId = useId()
  const [createOpen, setCreateOpen] = useState(false)
  const [editScope, setEditScope] = useState<RoleScopeResponse | null>(null)
  const [deactivateScope, setDeactivateScope] =
    useState<RoleScopeResponse | null>(null)
  const { data: scopes = [], isFetching, isError } = useRoleScopesQuery(
    role?.id ?? null,
    open && role != null,
  )

  useEffect(() => {
    if (!open) {
      setCreateOpen(false)
      setEditScope(null)
      setDeactivateScope(null)
    }
  }, [open])

  const rowActions = useMemo(
    () =>
      createRoleScopeRowActions({
        onEdit: setEditScope,
        onDeactivate: setDeactivateScope,
      }),
    [],
  )

  const { tableProps } = useClientDataTable({
    columns: roleScopeColumns,
    data: scopes,
    getRowId: (row) => row.id,
    enablePagination: true,
    initialState: { pageSize: 10 },
    isLoading: isFetching,
    rowActions,
    toolbarActions: (
      <button
        type="button"
        className={primaryButtonClassName}
        onClick={() => setCreateOpen(true)}
      >
        Create scope
      </button>
    ),
    emptyMessage: isError
      ? 'Could not load scopes'
      : 'No scopes for this role',
  })

  if (!open || !role) {
    return null
  }

  return (
    <>
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
          className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-surface p-6 shadow-lg"
        >
          <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
            <div>
              <h2
                id={titleId}
                className="text-xl font-semibold text-foreground"
              >
                Scopes
              </h2>
              <p className="mt-1 text-sm text-muted">
                Scopes for role{' '}
                <span className="font-medium text-foreground">{role.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
            >
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <DataTable {...tableProps} />
          </div>
        </div>
      </div>

      <RoleScopeCreateModal
        open={createOpen}
        role={role}
        onClose={() => setCreateOpen(false)}
      />

      <RoleScopeEditModal
        open={editScope != null}
        roleId={role.id}
        scope={editScope}
        onClose={() => setEditScope(null)}
      />

      <DeactivateRoleScopeDialog
        open={deactivateScope != null}
        roleId={role.id}
        scope={deactivateScope}
        onClose={() => setDeactivateScope(null)}
      />
    </>
  )
}
