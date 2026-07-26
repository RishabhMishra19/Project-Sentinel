import type { ReactNode, SubmitEventHandler } from "react";
import { ModalLayout, type ModalSize } from "./ModalLayout";

const cancelButtonClassName =
  "cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background";

const submitAccentClassName =
  "cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

const submitDangerClassName =
  "cursor-pointer rounded bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60";

type ModalFormProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  children: ReactNode;
  cancelLabel?: ReactNode;
  submitLabel?: ReactNode;
  submitDisabled?: boolean;
  submitVariant?: "accent" | "danger";
  size?: ModalSize;
  zIndex?: number;
  className?: string;
};

/**
 * Form modal: `ModalLayout` shell with a real `<form>` wrapping body + cancel/submit.
 */
export const ModalForm = ({
  open,
  onClose,
  title,
  description,
  onSubmit,
  children,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  submitDisabled = false,
  submitVariant = "accent",
  size = "md",
  zIndex = 50,
  className,
}: ModalFormProps) => {
  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      zIndex={zIndex}
      className={className}
    >
      <form onSubmit={onSubmit} className="flex flex-col">
        {children}
        <div className="mt-6 flex shrink-0 justify-end gap-2">
          <button type="button" onClick={onClose} className={cancelButtonClassName}>
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={submitDisabled}
            className={submitVariant === "danger" ? submitDangerClassName : submitAccentClassName}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};
