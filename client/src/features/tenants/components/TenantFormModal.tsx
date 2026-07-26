import { useEffect } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import type { CreateTenantResponse } from "../dto/response/tenant.response";
import type { TenantResponse } from "../dto/response/tenant.response";
import { useCreateTenant, useUpdateTenant } from "../hooks/useTenants";
import {
  createTenantFormSchema,
  updateTenantFormSchema,
  type CreateTenantFormValues,
  type UpdateTenantFormValues,
} from "../schemas/tenant.schema";

type TenantFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  tenant: TenantResponse | null;
  onClose: () => void;
  onCreated?: (created: CreateTenantResponse) => void;
};

export const TenantFormModal = ({
  open,
  mode,
  tenant,
  onClose,
  onCreated,
}: TenantFormModalProps) => {
  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();
  const { reset: resetCreate } = createMutation;
  const { reset: resetUpdate } = updateMutation;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useAppForm<CreateTenantFormValues>({
    schema: createTenantFormSchema,
    defaultValues: {
      name: "",
      slug: "",
      adminEmail: "",
      adminDisplayName: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useAppForm<UpdateTenantFormValues>({
    schema: updateTenantFormSchema,
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    resetCreate();
    resetUpdate();
    if (mode === "edit" && tenant) {
      resetEditForm({ name: tenant.name, slug: tenant.slug });
    } else {
      resetCreateForm({
        name: "",
        slug: "",
        adminEmail: "",
        adminDisplayName: "",
      });
    }
  }, [open, mode, tenant, resetCreate, resetUpdate, resetCreateForm, resetEditForm]);

  const onCreateSubmit = (data: CreateTenantFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (created) => {
        onClose();
        onCreated?.(created);
      },
    });
  };

  const onEditSubmit = (data: UpdateTenantFormValues) => {
    if (!tenant) {
      return;
    }
    updateMutation.mutate(
      { id: tenant.id, payload: data },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (mode === "edit") {
    return (
      <ModalForm
        open={open}
        onClose={onClose}
        title="Edit tenant"
        onSubmit={handleSubmitEdit(onEditSubmit)}
        submitLabel={isPending ? "Saving…" : "Save changes"}
        submitDisabled={isPending}
      >
        <div className="flex flex-col gap-4">
          <FormField
            label="Name"
            type="text"
            autoComplete="off"
            error={editErrors.name}
            registration={registerEdit("name")}
          />
          <FormField
            label="Slug"
            type="text"
            autoComplete="off"
            error={editErrors.slug}
            registration={registerEdit("slug")}
          />
        </div>
      </ModalForm>
    );
  }

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Create tenant"
      onSubmit={handleSubmitCreate(onCreateSubmit)}
      submitLabel={isPending ? "Creating…" : "Create tenant"}
      submitDisabled={isPending}
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="Name"
          type="text"
          autoComplete="off"
          error={createErrors.name}
          registration={registerCreate("name")}
        />
        <FormField
          label="Slug"
          type="text"
          autoComplete="off"
          error={createErrors.slug}
          registration={registerCreate("slug")}
        />
        <FormField
          label="Admin email"
          type="email"
          autoComplete="off"
          error={createErrors.adminEmail}
          registration={registerCreate("adminEmail")}
        />
        <FormField
          label="Admin display name"
          type="text"
          autoComplete="off"
          error={createErrors.adminDisplayName}
          registration={registerCreate("adminDisplayName")}
        />
      </div>
    </ModalForm>
  );
};
