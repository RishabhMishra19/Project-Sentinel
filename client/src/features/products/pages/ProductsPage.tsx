import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import { useModalState } from "../../../shared/hooks/useModalState";
import { PageContent } from "../../../shared/layout/PageContent";
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
  const view = useModalState<ProductResponse>();
  const deactivate = useModalState<ProductResponse>();

  return (
    <PageContent>
      <ProductsTable
        onCreate={() => setFormState({ open: true, mode: "create" })}
        onView={view.show}
        onEdit={(product) => setFormState({ open: true, mode: "edit", product })}
        onServices={(product) => navigate(`/${ROUTE_PATHS.services}?productId=${product.id}`)}
        onDeactivate={deactivate.show}
      />

      <ProductFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        product={formState.open && formState.mode === "edit" ? formState.product : null}
        onClose={() => setFormState({ open: false })}
      />

      <ProductViewModal open={view.open} product={view.item} onClose={view.close} />

      <DeactivateProductDialog
        open={deactivate.open}
        product={deactivate.item}
        onClose={deactivate.close}
      />
    </PageContent>
  );
};
