import { useEffect, useId, useRef } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import type { ServiceApiKeyCreatedResponse } from "../dto/response/apikey.response";
import { useCreateServiceApiKey } from "../hooks/useApiKeys";
import { apiKeyFormSchema, type ApiKeyFormValues } from "../schemas/apikey.schema";

type ApiKeyFormModalProps = {
  open: boolean;
  productId: string;
  serviceId: string;
  onClose: () => void;
  onCreated: (created: ServiceApiKeyCreatedResponse) => void;
};

export const ApiKeyFormModal = ({
  open,
  productId,
  serviceId,
  onClose,
  onCreated,
}: ApiKeyFormModalProps) => {
  const titleId = useId();
  const createMutation = useCreateServiceApiKey(productId, serviceId);
  const wasOpenRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<ApiKeyFormValues>({
    schema: apiKeyFormSchema,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;
    if (justOpened) {
      reset({ name: "" });
    }
  }, [open, reset]);

  if (!open) {
    return null;
  }

  const onSubmit = (data: ApiKeyFormValues) => {
    createMutation.mutate(
      { name: data.name },
      {
        onSuccess: (created) => {
          onClose();
          onCreated(created);
        },
      },
    );
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
            Create API key
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              disabled={createMutation.isPending}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMutation.isPending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
