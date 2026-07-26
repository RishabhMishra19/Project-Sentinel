import type { ReactNode } from "react";
import { ModalLayout, type ModalSize } from "./ModalLayout";

const cancelButtonClassName =
  "cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background";

const confirmAccentClassName =
  "cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

const confirmDangerClassName =
  "cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60";

type ModalConfirmLayoutProps = {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  confirmDisabled?: boolean;
  /** Defaults to `danger` for destructive confirms. */
  confirmVariant?: "accent" | "danger";
  size?: ModalSize;
  zIndex?: number;
  className?: string;
};

/**
 * Modal for confirmations: body + cancel/confirm actions (no `<form>`).
 */
export const ModalConfirmLayout = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
  children,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmDisabled = false,
  confirmVariant = "danger",
  size = "md",
  zIndex = 50,
  className,
}: ModalConfirmLayoutProps) => {
  return (
    <ModalLayout
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      size={size}
      zIndex={zIndex}
      className={className}
    >
      {children}

      <div className="mt-6 flex shrink-0 justify-end gap-2">
        <button type="button" onClick={onClose} className={cancelButtonClassName}>
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className={confirmVariant === "danger" ? confirmDangerClassName : confirmAccentClassName}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalLayout>
  );
};
