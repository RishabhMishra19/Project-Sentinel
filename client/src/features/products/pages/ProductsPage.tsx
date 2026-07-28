import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import type { ProductResponse } from "../dto/response/product.response";
import { DeactivateProductDialog } from "../components/DeactivateProductDialog";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductsTable } from "../components/ProductsTable";
import { ProductViewModal } from "../components/ProductViewModal";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; product: ProductResponse };

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [viewProduct, setViewProduct] = useState<ProductResponse | null>(null);
  const [deactivateProduct, setDeactivateProduct] = useState<ProductResponse | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ProductsTable
        onCreate={() => setFormState({ open: true, mode: "create" })}
        onView={setViewProduct}
        onEdit={(product) => setFormState({ open: true, mode: "edit", product })}
        onServices={(product) => navigate(`/${ROUTE_PATHS.services}?productId=${product.id}`)}
        onDeactivate={setDeactivateProduct}
      />

      <ProductFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        product={formState.open && formState.mode === "edit" ? formState.product : null}
        onClose={() => setFormState({ open: false })}
      />

      <ProductViewModal
        open={viewProduct != null}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      <DeactivateProductDialog
        open={deactivateProduct != null}
        product={deactivateProduct}
        onClose={() => setDeactivateProduct(null)}
      />
    </div>
  );
};
