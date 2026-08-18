import type { UseMutationResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ModalConfirmLayout } from "./ModalConfirmLayout";
import type { ModalSize, ModalZIndex } from "./ModalLayout";

type ConfirmMutationDialogProps<TItem, TVariables = string> = {
  open: boolean;
  item: TItem | null;
  title: ReactNode;
  description?: ReactNode;
  /** Body content; wrapped in muted paragraph styling. */
  message: (item: TItem) => ReactNode;
  onClose: () => void;
  mutation: Pick<UseMutationResult<unknown, unknown, TVariables>, "mutate" | "isPending">;
  getVariables: (item: TItem) => TVariables;
  confirmLabel?: string;
  confirmingLabel?: string;
  confirmVariant?: "accent" | "danger";
  size?: ModalSize;
  zIndex?: ModalZIndex;
};

/**
 * Confirm dialog that runs a React Query mutation with the selected item, then closes on success.
 */
export const ConfirmMutationDialog = <TItem, TVariables = string>({
  open,
  item,
  title,
  description,
  message,
  onClose,
  mutation,
  getVariables,
  confirmLabel = "Confirm",
  confirmingLabel = "Working…",
  confirmVariant = "danger",
  size,
  zIndex,
}: ConfirmMutationDialogProps<TItem, TVariables>) => {
  if (!open || !item) {
    return null;
  }

  return (
    <ModalConfirmLayout
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onConfirm={() => {
        mutation.mutate(getVariables(item), {
          onSuccess: () => {
            onClose();
          },
        });
      }}
      confirmLabel={mutation.isPending ? confirmingLabel : confirmLabel}
      confirmDisabled={mutation.isPending}
      confirmVariant={confirmVariant}
      size={size}
      zIndex={zIndex}
    >
      <p className="text-sm text-muted">{message(item)}</p>
    </ModalConfirmLayout>
  );
};
