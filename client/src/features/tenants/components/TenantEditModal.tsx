import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { TenantResponse } from "../dto/response/tenant.response";
import { useUpdateTenant } from "../hooks/useTenants";
import { updateTenantFormSchema, type UpdateTenantFormValues } from "../schemas/tenant.schema";

type TenantEditModalProps = {
  open: boolean;
  tenant: TenantResponse | null;
  onClose: () => void;
};

export const TenantEditModal = ({ open, tenant, onClose }: TenantEditModalProps) => {
  const updateMutation = useUpdateTenant();
  const { reset: resetMutation } = updateMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateTenantFormValues>({
    schema: updateTenantFormSchema,
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (!open || !tenant) {
      return;
    }
    resetMutation();
    reset({ name: tenant.name, slug: tenant.slug });
  }, [open, tenant, reset, resetMutation]);

  if (!open || !tenant) {
    return null;
  }

  const onSubmit = (data: UpdateTenantFormValues) => {
    updateMutation.mutate(
      { id: tenant.id, payload: data },
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
      title="Edit tenant"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
      submitDisabled={updateMutation.isPending}
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          type="text"
          autoComplete="off"
          error={errors.name}
          registration={register("name")}
        />
        <FormField
          label="Slug"
          type="text"
          autoComplete="off"
          error={errors.slug}
          registration={register("slug")}
        />
      </div>
    </ModalForm>
  );
};
