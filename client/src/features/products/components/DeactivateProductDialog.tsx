import { ModalConfirmLayout } from "../../../shared/ui";
import type { ProductResponse } from "../dto/response/product.response";
import { useDeleteProduct } from "../hooks/useProducts";

type DeactivateProductDialogProps = {
  open: boolean;
  product: ProductResponse | null;
  onClose: () => void;
};

export const DeactivateProductDialog = ({
  open,
  product,
  onClose,
}: DeactivateProductDialogProps) => {
  const deleteMutation = useDeleteProduct();

  if (!open || !product) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title="Deactivate product"
      onClose={onClose}
      onConfirm={() => {
        deleteMutation.mutate(product.id, {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={deleteMutation.isPending ? "Deactivating…" : "Deactivate"}
      confirmDisabled={deleteMutation.isPending}
    >
      <p className="text-sm text-muted">
        Deactivate <span className="font-medium text-foreground">{product.name}</span>? The product
        will be marked inactive. Child services are not changed.
      </p>
    </ModalConfirmLayout>
  );
};
