import { useState } from 'react'
import type { RoleResponse } from '../dto/response/role.response'
import { MarkInactiveRoleDialog } from '../components/MarkInactiveRoleDialog'
import { RoleCreateModal } from '../components/RoleCreateModal'
import { RoleEditModal } from '../components/RoleEditModal'
import { RoleScopesModal } from '../components/RoleScopesModal'
import { RoleViewModal } from '../components/RoleViewModal'
import { RolesTable } from '../components/RolesTable'

export const RolesPage = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [viewRoleId, setViewRoleId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<RoleResponse | null>(null)
  const [scopesRole, setScopesRole] = useState<RoleResponse | null>(null)
  const [inactiveRole, setInactiveRole] = useState<RoleResponse | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <RolesTable
        onCreate={() => setCreateOpen(true)}
        onView={(role) => setViewRoleId(role.id)}
        onEdit={setEditRole}
        onShowScopes={setScopesRole}
        onMarkInactive={setInactiveRole}
      />

      <RoleCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <RoleViewModal
        open={viewRoleId != null}
        roleId={viewRoleId}
        onClose={() => setViewRoleId(null)}
      />

      <RoleEditModal
        open={editRole != null}
        role={editRole}
        onClose={() => setEditRole(null)}
      />

      <RoleScopesModal
        open={scopesRole != null}
        role={scopesRole}
        onClose={() => setScopesRole(null)}
      />

      <MarkInactiveRoleDialog
        open={inactiveRole != null}
        role={inactiveRole}
        onClose={() => setInactiveRole(null)}
      />
    </div>
  )
}
