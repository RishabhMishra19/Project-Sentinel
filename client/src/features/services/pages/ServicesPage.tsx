import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import { useModalState } from "../../../shared/hooks/useModalState";
import { useUrlSyncedSelection } from "../../../shared/hooks/useUrlSyncedSelection";
import { PageContent } from "../../../shared/layout/PageContent";
import { QueryGate } from "../../../shared/ui";
import type { ServiceResponse } from "../dto/response/service.response";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { DeactivateServiceDialog } from "../components/DeactivateServiceDialog";
import { ServiceFormModal } from "../components/ServiceFormModal";
import { ServicesTable } from "../components/ServicesTable";
import { ServiceViewModal } from "../components/ServiceViewModal";

const ACTIVE_PRODUCTS_PARAMS = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; service: ServiceResponse };

export const ServicesPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({ open: false });
  const view = useModalState<ServiceResponse>();
  const deactivate = useModalState<ServiceResponse>();

  const productsQuery = useProductsQuery(ACTIVE_PRODUCTS_PARAMS);
  const products = productsQuery.rows;
  const { selectedId: selectedProductId, onChange: onProductChange } = useUrlSyncedSelection({
    paramKey: "productId",
    items: products,
  });

  const activeProductId =
    formState.open && formState.mode === "edit"
      ? formState.service.productId
      : (deactivate.item?.productId ?? selectedProductId);

  return (
    <PageContent className="min-h-64">
      <QueryGate
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        loadingMessage="Loading products…"
        errorMessage="Could not load products."
      >
        <ServicesTable
          key={selectedProductId ?? "no-product"}
          products={products}
          selectedProductId={selectedProductId}
          onProductChange={onProductChange}
          onCreate={() => setFormState({ open: true, mode: "create" })}
          onView={view.show}
          onEdit={(service) => setFormState({ open: true, mode: "edit", service })}
          onViewApiKeys={(service) => navigate(`/${ROUTE_PATHS.apiKeys}?serviceId=${service.id}`)}
          onDeactivate={deactivate.show}
        />
      </QueryGate>

      <ServiceFormModal
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        productId={
          formState.open && formState.mode === "edit"
            ? formState.service.productId
            : (selectedProductId ?? undefined)
        }
        service={formState.open && formState.mode === "edit" ? formState.service : null}
        onClose={() => setFormState({ open: false })}
      />

      <ServiceViewModal open={view.open} service={view.item} onClose={view.close} />

      <DeactivateServiceDialog
        open={deactivate.open}
        productId={activeProductId ?? ""}
        service={deactivate.item}
        onClose={deactivate.close}
      />
    </PageContent>
  );
};
