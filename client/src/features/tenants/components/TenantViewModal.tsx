import { DetailRow, ModalViewLayout } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { TenantResponse } from "../dto/response/tenant.response";

type TenantViewModalProps = {
  open: boolean;
  tenant: TenantResponse | null;
  onClose: () => void;
};

export const TenantViewModal = ({ open, tenant, onClose }: TenantViewModalProps) => {
  if (!open || !tenant) {
    return null;
  }

  return (
    <ModalViewLayout open={open} title="Tenant details" onClose={onClose}>
      <dl className="flex flex-col gap-3">
        <DetailRow label="Name" value={tenant.name} />
        <DetailRow label="Slug" value={tenant.slug} />
        <DetailRow
          label="Admins"
          value={tenant.adminEmails.length > 0 ? tenant.adminEmails.join(", ") : "—"}
        />
        <DetailRow label="Status" value={tenant.status === "ACTIVE" ? "Active" : "Inactive"} />
        <DetailRow label="Created" value={formatDateTime(tenant.createdAt)} />
        <DetailRow
          label="Created by"
          value={`${tenant.createdBy.name} (${tenant.createdBy.email})`}
        />
        <DetailRow label="Updated" value={formatDateTime(tenant.updatedAt)} />
        <DetailRow
          label="Updated by"
          value={`${tenant.updatedBy.name} (${tenant.updatedBy.email})`}
        />
      </dl>
    </ModalViewLayout>
  );
};
