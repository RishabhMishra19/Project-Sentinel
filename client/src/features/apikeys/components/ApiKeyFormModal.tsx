import { useEffect, useRef } from "react";
import { FormField } from "../../../shared/forms/FormField";
import { useAppForm } from "../../../shared/forms/useAppForm";
import { ModalForm } from "../../../shared/ui";
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
    <ModalForm
      open={open}
      onClose={onClose}
      title="Create API key"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={createMutation.isPending ? "Creating…" : "Create"}
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
      </div>
    </ModalForm>
  );
};
