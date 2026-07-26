import { useId, type ReactNode } from "react";

const sizeClassName = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "4xl": "max-w-4xl",
} as const;

export type ModalSize = keyof typeof sizeClassName;

type ModalLayoutProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  zIndex?: number;
  className?: string;
};

/**
 * Modal shell only: backdrop, dialog panel, title/description, and header close.
 * Use `ModalForm` when you need cancel/submit inside a form.
 */
export const ModalLayout = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  zIndex = 50,
  className,
}: ModalLayoutProps) => {
  const titleId = useId();

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-foreground/40 px-4 ${
        zIndex === 60 ? "z-[60]" : "z-50"
      }`}
    >
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
        className={[
          "relative z-10 w-full rounded-xl bg-surface p-6 shadow-lg",
          sizeClassName[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
