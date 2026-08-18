import { useState } from "react";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
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
  const edit = useModalState<UserResponse>();
  const view = useModalState<UserResponse>();
  const assign = useModalState<UserResponse>();
  const inactive = useModalState<UserResponse>();
  const revealedPassword = useModalState<string>();

  const onCreated = (created: CreateUserResponse) => {
    revealedPassword.show(created.temporaryPassword);
  };

  return (
    <PageContent>
      <UsersTable
        onCreate={() => setCreateOpen(true)}
        onView={view.show}
        onEdit={edit.show}
        onAssignRole={assign.show}
        onMarkInactive={inactive.show}
      />

      <UserCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <UserEditModal open={edit.open} user={edit.item} onClose={edit.close} />

      <UserViewModal open={view.open} user={view.item} onClose={view.close} />

      <AssignRoleDialog open={assign.open} user={assign.item} onClose={assign.close} />

      <MarkInactiveUserDialog open={inactive.open} user={inactive.item} onClose={inactive.close} />

      <SecretRevealDialog
        open={revealedPassword.open}
        value={revealedPassword.item}
        onClose={revealedPassword.close}
        title="Temporary password"
        description="Copy this password now and share it securely with the user. It will not be shown again."
        copySuccessMessage="Temporary password copied to clipboard."
        copyErrorMessage="Could not copy temporary password."
      />
    </PageContent>
  );
};
