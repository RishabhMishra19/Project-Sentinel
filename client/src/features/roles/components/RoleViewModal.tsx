import { DetailRow, ModalViewLayout, QueryGate } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import { useRoleQuery } from "../hooks/useRoles";

type RoleViewModalProps = {
  open: boolean;
  roleId: string | null;
  onClose: () => void;
};

export const RoleViewModal = ({ open, roleId, onClose }: RoleViewModalProps) => {
  const { data: role, isFetching, isError } = useRoleQuery(roleId, open);

  if (!open || !roleId) {
    return null;
  }

  const isLoading = isFetching && !role;

  return (
    <ModalViewLayout open={open} title="Role details" onClose={onClose} className="flex flex-col">
      <QueryGate
        isLoading={isLoading}
        isError={isError || (!isLoading && !role)}
        errorMessage="Could not load role."
        className="min-h-40"
      >
        {role ? (
          <dl className="flex flex-col gap-3">
            <DetailRow label="Name" value={role.name} />
            <DetailRow label="Status" value={role.status === "ACTIVE" ? "Active" : "Inactive"} />
            <DetailRow
              label="Created by"
              value={`${role.createdBy.name} (${role.createdBy.email})`}
            />
            <DetailRow
              label="Updated by"
              value={`${role.updatedBy.name} (${role.updatedBy.email})`}
            />
            <DetailRow label="Created" value={formatDateTime(role.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(role.updatedAt)} />
          </dl>
        ) : null}
      </QueryGate>
    </ModalViewLayout>
  );
};
