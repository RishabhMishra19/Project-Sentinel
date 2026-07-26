import { DetailRow, ModalViewLayout } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { UserResponse } from "../dto/response/user.response";

type UserViewModalProps = {
  open: boolean;
  user: UserResponse | null;
  onClose: () => void;
};

export const UserViewModal = ({ open, user, onClose }: UserViewModalProps) => {
  if (!open || !user) {
    return null;
  }

  return (
    <ModalViewLayout open={open} title="User details" onClose={onClose}>
      <dl className="flex flex-col gap-3">
        <DetailRow label="Display name" value={user.displayName} />
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Tenant admin" value={user.tenantAdmin ? "Yes" : "No"} />
        <DetailRow label="Status" value={user.status === "ACTIVE" ? "Active" : "Inactive"} />
        <DetailRow
          label="Roles"
          value={user.roles.length > 0 ? user.roles.map((role) => role.name).join(", ") : "None"}
        />
        <DetailRow label="Created" value={formatDateTime(user.createdAt)} />
        <DetailRow label="Updated" value={formatDateTime(user.updatedAt)} />
        <DetailRow label="Last login" value={formatDateTime(user.lastLoginAt)} />
      </dl>
    </ModalViewLayout>
  );
};
