import { useEffect, useRef } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import { toast } from "../../../shared/ui/toast";
import type { ProductResponse } from "../../products/dto/response/product.response";
import type { ServiceResponse } from "../dto/response/service.response";
import { useCreateService, useUpdateService } from "../hooks/useServices";
import { serviceFormSchema, type ServiceFormValues } from "../schemas/service.schema";

const EMPTY_PRODUCTS: ProductResponse[] = [];

type ServiceFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  /** Fixed product when creating from a product page; optional on tenant-wide page. */
  productId?: string;
  /** Product options when creating without a fixed productId. */
  products?: ProductResponse[];
  service: ServiceResponse | null;
  onClose: () => void;
};

export const ServiceFormModal = ({
  open,
  mode,
  productId,
  products = EMPTY_PRODUCTS,
  service,
  onClose,
}: ServiceFormModalProps) => {
  const createMutation = useCreateService(productId);
  const updateProductId = service?.productId ?? productId ?? "";
  const updateMutation = useUpdateService(updateProductId || "pending");
  const isPending = createMutation.isPending || updateMutation.isPending;
  const needsProductSelect = mode === "create" && !productId;
  const defaultProductId = productId ?? products[0]?.id ?? "";
  const wasOpenRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useAppForm<ServiceFormValues & { productId?: string }>({
    schema: serviceFormSchema,
    defaultValues: { name: "", productId: "" },
  });

  const selectedProductId = watch("productId");

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (!justOpened) {
      return;
    }

    if (mode === "edit" && service) {
      reset({ name: service.name, productId: service.productId });
    } else {
      reset({
        name: "",
        productId: defaultProductId,
      });
    }
  }, [open, mode, service, defaultProductId, reset]);

  const onSubmit = (data: ServiceFormValues & { productId?: string }) => {
    if (mode === "edit" && service) {
      updateMutation.mutate(
        {
          id: service.id,
          payload: { name: data.name },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
      return;
    }

    const targetProductId = productId ?? data.productId ?? selectedProductId;
    if (!targetProductId) {
      toast.error("Select a product for this service.");
      return;
    }

    createMutation.mutate(
      {
        productId: targetProductId,
        payload: { name: data.name },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit service" : "Create service"}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={
        isPending
          ? mode === "edit"
            ? "Saving…"
            : "Creating…"
          : mode === "edit"
            ? "Save changes"
            : "Create service"
      }
      submitDisabled={isPending || (needsProductSelect && products.length === 0)}
    >
      <div className="flex flex-col gap-4">
        {needsProductSelect ? (
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Product
            <select
              className="rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring"
              value={selectedProductId ?? ""}
              onChange={(event) => setValue("productId", event.target.value)}
            >
              {products.length === 0 ? (
                <option value="">No products available</option>
              ) : (
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))
              )}
            </select>
          </label>
        ) : null}

        <FormField
          label="Name"
          type="text"
          autoComplete="off"
          error={errors.name}
          registration={register("name")}
        />
      </div>
    </ModalForm>
  );
};
