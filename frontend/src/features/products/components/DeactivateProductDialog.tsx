import { ConfirmMutationDialog } from "../../../shared/ui";
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

  return (
    <ConfirmMutationDialog
      open={open}
      item={product}
      title="Deactivate product"
      onClose={onClose}
      mutation={deleteMutation}
      getVariables={(item) => item.id}
      confirmLabel="Deactivate"
      confirmingLabel="Deactivating…"
      message={(item) => (
        <>
          Deactivate <span className="font-medium text-foreground">{item.name}</span>? The product
          will be marked inactive. Child services are not changed.
        </>
      )}
    />
  );
};
