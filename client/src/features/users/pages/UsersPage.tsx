import { useState } from "react";
import { SecretRevealDialog } from "../../../shared/ui";
import type { CreateUserResponse, UserResponse } from "../dto/response/user.response";
import { AssignRoleDialog } from "../components/AssignRoleDialog";
import { MarkInactiveUserDialog } from "../components/MarkInactiveUserDialog";
import { UserCreateModal } from "../components/UserCreateModal";
import { UserEditModal } from "../components/UserEditModal";
import { UsersTable } from "../components/UsersTable";
import { UserViewModal } from "../components/UserViewModal";

export const UsersPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [viewUser, setViewUser] = useState<UserResponse | null>(null);
  const [assignUser, setAssignUser] = useState<UserResponse | null>(null);
  const [inactiveUser, setInactiveUser] = useState<UserResponse | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);

  const onCreated = (created: CreateUserResponse) => {
    setRevealedPassword(created.temporaryPassword);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <UsersTable
        onCreate={() => setCreateOpen(true)}
        onView={setViewUser}
        onEdit={setEditUser}
        onAssignRole={setAssignUser}
        onMarkInactive={setInactiveUser}
      />

      <UserCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <UserEditModal open={editUser != null} user={editUser} onClose={() => setEditUser(null)} />

      <UserViewModal open={viewUser != null} user={viewUser} onClose={() => setViewUser(null)} />

      <AssignRoleDialog
        open={assignUser != null}
        user={assignUser}
        onClose={() => setAssignUser(null)}
      />

      <MarkInactiveUserDialog
        open={inactiveUser != null}
        user={inactiveUser}
        onClose={() => setInactiveUser(null)}
      />

      <SecretRevealDialog
        open={revealedPassword != null}
        value={revealedPassword}
        onClose={() => setRevealedPassword(null)}
        title="Temporary password"
        description="Copy this password now and share it securely with the user. It will not be shown again."
        copySuccessMessage="Temporary password copied to clipboard."
        copyErrorMessage="Could not copy temporary password."
      />
    </div>
  );
};
