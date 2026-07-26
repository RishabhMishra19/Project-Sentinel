import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { CreateTenantResponse } from "../dto/response/tenant.response";
import { useCreateTenant } from "../hooks/useTenants";
import { createTenantFormSchema, type CreateTenantFormValues } from "../schemas/tenant.schema";

type TenantCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: CreateTenantResponse) => void;
};

export const TenantCreateModal = ({ open, onClose, onCreated }: TenantCreateModalProps) => {
  const createMutation = useCreateTenant();
  const { reset: resetMutation } = createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<CreateTenantFormValues>({
    schema: createTenantFormSchema,
    defaultValues: {
      name: "",
      slug: "",
      adminEmail: "",
      adminDisplayName: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    resetMutation();
    reset({
      name: "",
      slug: "",
      adminEmail: "",
      adminDisplayName: "",
    });
  }, [open, reset, resetMutation]);

  const onSubmit = (data: CreateTenantFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (created) => {
        onClose();
        onCreated?.(created);
      },
    });
  };

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Create tenant"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={createMutation.isPending ? "Creating…" : "Create tenant"}
      submitDisabled={createMutation.isPending}
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
        <FormField
          label="Admin email"
          type="email"
          autoComplete="off"
          error={errors.adminEmail}
          registration={register("adminEmail")}
        />
        <FormField
          label="Admin display name"
          type="text"
          autoComplete="off"
          error={errors.adminDisplayName}
          registration={register("adminDisplayName")}
        />
      </div>
    </ModalForm>
  );
};
