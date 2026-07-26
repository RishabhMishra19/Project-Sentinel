import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const productIdFromUrl = searchParams.get("productId");
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [viewService, setViewService] = useState<ServiceResponse | null>(null);
  const [deactivateService, setDeactivateService] = useState<ServiceResponse | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productIdFromUrl);

  const productsQuery = useProductsQuery(ACTIVE_PRODUCTS_PARAMS);
  const products = productsQuery.rows;

  useEffect(() => {
    if (products.length === 0) {
      setSelectedProductId(null);
      return;
    }
    setSelectedProductId((current) => {
      if (productIdFromUrl && products.some((p) => p.id === productIdFromUrl)) {
        return productIdFromUrl;
      }
      if (current && products.some((product) => product.id === current)) {
        return current;
      }
      return products[0]!.id;
    });
  }, [products, productIdFromUrl]);

  const onProductChange = (productId: string) => {
    setSelectedProductId(productId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("productId", productId);
        return next;
      },
      { replace: true },
    );
  };

  const activeProductId =
    formState.open && formState.mode === "edit"
      ? formState.service.productId
      : (deactivateService?.productId ?? selectedProductId);

  return (
    <div className="mx-auto flex min-h-64 w-full max-w-6xl flex-col gap-6">
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
          onView={setViewService}
          onEdit={(service) => setFormState({ open: true, mode: "edit", service })}
          onViewApiKeys={(service) =>
            navigate(
              `/${ROUTE_PATHS.serviceApiKeys.replace(":serviceId", encodeURIComponent(service.id))}?productId=${service.productId}`,
            )
          }
          onDeactivate={setDeactivateService}
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

      <ServiceViewModal
        open={viewService != null}
        service={viewService}
        onClose={() => setViewService(null)}
      />

      <DeactivateServiceDialog
        open={deactivateService != null}
        productId={activeProductId ?? ""}
        service={deactivateService}
        onClose={() => setDeactivateService(null)}
      />
    </div>
  );
};
