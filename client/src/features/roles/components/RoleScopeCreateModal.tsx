import { useEffect, useId } from "react";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAllServicesQuery } from "../../services/hooks/useServices";
import type { RoleResponse } from "../dto/response/role.response";
import { useCreateRoleScope } from "../hooks/useRoles";
import { createRoleScopeFormSchema, type CreateRoleScopeFormValues } from "../schemas/role.schema";

const selectClassName =
  "rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring";

type RoleScopeCreateModalProps = {
  open: boolean;
  role: RoleResponse | null;
  onClose: () => void;
};

export const RoleScopeCreateModal = ({ open, role, onClose }: RoleScopeCreateModalProps) => {
  const titleId = useId();
  const createMutation = useCreateRoleScope(role?.id ?? null);
  const { reset: resetMutation } = createMutation;

  const { data: productsPage, isFetching: productsLoading } = useProductsQuery(
    open ? { page: 0, size: 100, status: "ACTIVE" } : null,
  );
  const { data: servicesPage, isFetching: servicesLoading } = useAllServicesQuery(
    open ? { page: 0, size: 100, status: "ACTIVE" } : null,
  );

  const {
    register,
    handleSubmit,
    reset,
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
    reset({
      scopeType: "PRODUCT",
      scopeId: "",
      permission: "READ",
    });
  }, [open, reset, resetMutation]);

  useEffect(() => {
    setValue("scopeId", "");
  }, [scopeType, setValue]);

  if (!open || !role) {
    return null;
  }

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

  const products = productsPage?.content ?? [];
  const services = servicesPage?.content ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 px-4">
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
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              Create scope
            </h2>
            <p className="mt-1 text-sm text-muted">
              For role <span className="font-medium text-foreground">{role.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Scope type
            <select className={selectClassName} {...register("scopeType")}>
              <option value="PRODUCT">PRODUCT</option>
              <option value="SERVICE">SERVICE</option>
            </select>
            {errors.scopeType?.message ? (
              <span className="text-sm text-danger">{errors.scopeType.message}</span>
            ) : null}
          </label>

          {scopeType === "PRODUCT" ? (
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Product
              <select
                className={selectClassName}
                disabled={productsLoading || products.length === 0}
                {...register("scopeId")}
              >
                <option value="">
                  {productsLoading ? "Loading products…" : "Select a product"}
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.scopeId?.message ? (
                <span className="text-sm text-danger">{errors.scopeId.message}</span>
              ) : null}
            </label>
          ) : null}

          {scopeType === "SERVICE" ? (
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Service
              <select
                className={selectClassName}
                disabled={servicesLoading || services.length === 0}
                {...register("scopeId")}
              >
                <option value="">
                  {servicesLoading ? "Loading services…" : "Select a service"}
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.scopeId?.message ? (
                <span className="text-sm text-danger">{errors.scopeId.message}</span>
              ) : null}
            </label>
          ) : null}

          <label className="flex flex-col gap-1 text-sm text-foreground">
            Permission
            <select className={selectClassName} {...register("permission")}>
              <option value="READ">READ</option>
              <option value="READ_AND_WRITE">READ_AND_WRITE</option>
              <option value="ALL">ALL</option>
            </select>
            {errors.permission?.message ? (
              <span className="text-sm text-danger">{errors.permission.message}</span>
            ) : null}
          </label>

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
              disabled={createMutation.isPending}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMutation.isPending ? "Creating…" : "Create scope"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
