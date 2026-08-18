import { useEffect } from "react";
import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { SelectField } from "../../../shared/forms/SelectField";
import { ServerSelectField } from "../../../shared/forms/ServerSelectField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery } from "../../services/hooks/useServices";
import type { RoleResponse } from "../dto/response/role.response";
import { useCreateRoleScope } from "../hooks/useRoles";
import { createRoleScopeFormSchema, type CreateRoleScopeFormValues } from "../schemas/role.schema";

const ACTIVE_LIST_QUERY: ListQueryRequest = {
  pageable: { page: 0, size: 100 },
  filterConfigs: [{ fieldName: "status", filterValues: ["ACTIVE"] }],
};

const SCOPE_TYPE_OPTIONS = [
  { value: "PRODUCT", label: "PRODUCT" },
  { value: "SERVICE", label: "SERVICE" },
] as const;

const PERMISSION_OPTIONS = [
  { value: "READ", label: "READ" },
  { value: "READ_AND_WRITE", label: "READ_AND_WRITE" },
  { value: "ALL", label: "ALL" },
] as const;

type RoleScopeCreateModalProps = {
  open: boolean;
  role: RoleResponse;
  onClose: () => void;
};

export const RoleScopeCreateModal = ({ open, role, onClose }: RoleScopeCreateModalProps) => {
  const createMutation = useCreateRoleScope(role?.id ?? null);
  const { reset: resetMutation } = createMutation;

  const productsQuery = useProductsQuery(open ? ACTIVE_LIST_QUERY : null);
  const servicesQuery = useAllServicesQuery(open ? ACTIVE_LIST_QUERY : null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useAppForm<CreateRoleScopeFormValues>({
    schema: createRoleScopeFormSchema,
    defaultValues: {
      scopeType: "PRODUCT",
      scopeId: "",
      permission: "READ",
    },
  });

  const scopeType = watch("scopeType");

  useEffect(() => {
    if (!open) {
      return;
    }
    resetMutation();
  }, [open, resetMutation]);

  useEffect(() => {
    setValue("scopeId", "");
  }, [scopeType, setValue]);

  const onSubmit = (data: CreateRoleScopeFormValues) => {
    createMutation.mutate(
      {
        scopeType: data.scopeType,
        scopeId: data.scopeId,
        permission: data.permission,
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
      title="Create scope"
      description={
        <>
          For role <span className="font-medium text-foreground">{role.name}</span>
        </>
      }
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={createMutation.isPending ? "Creating…" : "Create scope"}
      submitDisabled={createMutation.isPending}
      zIndex={60}
    >
      <div className="flex flex-col gap-4">
        <SelectField
          label="Scope type"
          options={SCOPE_TYPE_OPTIONS}
          error={errors.scopeType}
          {...register("scopeType")}
        />

        {scopeType === "PRODUCT" ? (
          <ServerSelectField
            label="Product"
            query={productsQuery}
            toOption={(product) => ({ value: product.id, label: product.name })}
            placeholder="Select a product"
            loadingPlaceholder="Loading products…"
            emptyPlaceholder="No products available"
            errorMessage="Could not load products."
            error={errors.scopeId}
            {...register("scopeId")}
          />
        ) : null}

        {scopeType === "SERVICE" ? (
          <ServerSelectField
            label="Service"
            query={servicesQuery}
            toOption={(service) => ({ value: service.id, label: service.name })}
            placeholder="Select a service"
            loadingPlaceholder="Loading services…"
            emptyPlaceholder="No services available"
            errorMessage="Could not load services."
            error={errors.scopeId}
            {...register("scopeId")}
          />
        ) : null}

        <SelectField
          label="Permission"
          options={PERMISSION_OPTIONS}
          error={errors.permission}
          {...register("permission")}
        />

      </div>
    </ModalForm>
  );
};
