import { DetailRow, ModalViewLayout } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { ServiceResponse } from "../dto/response/service.response";

type ServiceViewModalProps = {
  open: boolean;
  service: ServiceResponse | null;
  onClose: () => void;
};

export const ServiceViewModal = ({ open, service, onClose }: ServiceViewModalProps) => {
  if (!open || !service) {
    return null;
  }

  return (
    <ModalViewLayout open={open} title="Service details" onClose={onClose}>
      <dl className="flex flex-col gap-3">
        <DetailRow label="Name" value={service.name} />
        <DetailRow label="Product" value={service.productName} />
        <DetailRow label="Status" value={service.status === "ACTIVE" ? "Active" : "Inactive"} />
        <DetailRow label="Created" value={formatDateTime(service.createdAt)} />
        <DetailRow
          label="Created by"
          value={`${service.createdBy.name} (${service.createdBy.email})`}
        />
        <DetailRow label="Updated" value={formatDateTime(service.updatedAt)} />
        <DetailRow
          label="Updated by"
          value={`${service.updatedBy.name} (${service.updatedBy.email})`}
        />
      </dl>
    </ModalViewLayout>
  );
};
