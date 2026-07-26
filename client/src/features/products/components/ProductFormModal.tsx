import { useEffect, useId } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
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
  const titleId = useId();
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

  if (!open) {
    return null;
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">
            {mode === "edit" ? "Edit product" : "Create product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Name"
            type="text"
            autoComplete="off"
            error={errors.name}
            registration={register("name")}
          />

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? mode === "edit"
                  ? "Saving…"
                  : "Creating…"
                : mode === "edit"
                  ? "Save changes"
                  : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
