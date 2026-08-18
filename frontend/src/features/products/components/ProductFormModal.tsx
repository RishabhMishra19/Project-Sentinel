import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { ProductResponse } from "../dto/response/product.response";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { productFormSchema, type ProductFormValues } from "../schemas/product.schema";

type ProductFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  product: ProductResponse | null;
  onClose: () => void;
};

export const ProductFormModal = ({ open, mode, product, onClose }: ProductFormModalProps) => {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { reset: resetCreate } = createMutation;
  const { reset: resetUpdate } = updateMutation;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<ProductFormValues>({
    schema: productFormSchema,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    resetCreate();
    resetUpdate();
    if (mode === "edit" && product) {
      reset({ name: product.name });
    } else {
      reset({ name: "" });
    }
  }, [open, mode, product, reset, resetCreate, resetUpdate]);

  const onSubmit = (data: ProductFormValues) => {
    if (mode === "edit" && product) {
      updateMutation.mutate(
        { id: product.id, payload: data },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit product" : "Create product"}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={
        isPending
          ? mode === "edit"
            ? "Saving…"
            : "Creating…"
          : mode === "edit"
            ? "Save changes"
            : "Create product"
      }
      submitDisabled={isPending}
    >
      <div className="flex flex-col gap-4">
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
