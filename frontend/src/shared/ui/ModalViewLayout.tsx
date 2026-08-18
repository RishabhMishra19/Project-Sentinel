import type { ReactNode } from "react";
import { ModalLayout, type ModalSize, type ModalZIndex } from "./ModalLayout";

const closeButtonClassName =
  "cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background";

type ModalViewLayoutProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  closeLabel?: ReactNode;
  size?: ModalSize;
  zIndex?: ModalZIndex;
  className?: string;
};

/**
 * Read-only / details modal: `ModalLayout` shell with a single footer dismiss action.
 */
export const ModalViewLayout = ({
  open,
  onClose,
  title,
  description,
  children,
  closeLabel = "Close",
  size = "md",
  zIndex = 50,
  className,
}: ModalViewLayoutProps) => {
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
      {children}
      <div className="mt-6 flex shrink-0 justify-end">
        <button type="button" onClick={onClose} className={closeButtonClassName}>
          {closeLabel}
        </button>
      </div>
    </ModalLayout>
  );
};
