import { DetailRow, ModalViewLayout } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { ProductResponse } from "../dto/response/product.response";

type ProductViewModalProps = {
  open: boolean;
  product: ProductResponse | null;
  onClose: () => void;
};

export const ProductViewModal = ({ open, product, onClose }: ProductViewModalProps) => {
  if (!open || !product) {
    return null;
  }

  return (
    <ModalViewLayout open={open} title="Product details" onClose={onClose}>
      <dl className="flex flex-col gap-3">
        <DetailRow label="Name" value={product.name} />
        <DetailRow label="Status" value={product.status === "ACTIVE" ? "Active" : "Inactive"} />
        <DetailRow label="Created" value={formatDateTime(product.createdAt)} />
        <DetailRow
          label="Created by"
          value={`${product.createdBy.name} (${product.createdBy.email})`}
        />
        <DetailRow label="Updated" value={formatDateTime(product.updatedAt)} />
        <DetailRow
          label="Updated by"
          value={`${product.updatedBy.name} (${product.updatedBy.email})`}
        />
      </dl>
    </ModalViewLayout>
  );
};
