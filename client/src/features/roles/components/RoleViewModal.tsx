import { ModalLayout, QueryGate } from "../../../shared/ui";
import { useRoleQuery } from "../hooks/useRoles";

type RoleViewModalProps = {
  open: boolean;
  roleId: string | null;
  onClose: () => void;
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
);

export const RoleViewModal = ({ open, roleId, onClose }: RoleViewModalProps) => {
  const { data: role, isFetching, isError } = useRoleQuery(roleId, open);

  if (!open || !roleId) {
    return null;
  }

  const isLoading = isFetching && !role;

  return (
    <ModalLayout open={open} title="Role details" onClose={onClose} className="flex flex-col">
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
    </ModalLayout>
  );
};
