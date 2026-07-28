import { useEffect, useId, useRef, type ReactNode } from "react";

const sizeClassName = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "4xl": "max-w-4xl",
} as const;

const zIndexClassName = {
  50: "z-50",
  60: "z-[60]",
} as const;

export type ModalSize = keyof typeof sizeClassName;
export type ModalZIndex = keyof typeof zIndexClassName;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );

type ModalLayoutProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  zIndex?: ModalZIndex;
  className?: string;
  /** When false, Escape / backdrop / header close are disabled. Defaults to true. */
  dismissible?: boolean;
};

/**
 * Modal shell only: backdrop, dialog panel, title/description, and header close.
 * Use `ModalForm` when you need cancel/submit inside a form.
 * Use `ModalViewLayout` when you need a single footer dismiss action.
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
  dismissible = true,
}: ModalLayoutProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (dismissible) {
          onCloseRef.current();
        }
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, dismissible]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-foreground/40 px-4 ${zIndexClassName[zIndex]}`}
    >
      {dismissible ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close dialog backdrop"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
        />
      ) : (
        <div className="absolute inset-0" aria-hidden="true" />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          "relative z-10 w-full rounded-xl bg-surface p-6 shadow-lg outline-none",
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
          {dismissible ? (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
            >
              Close
            </button>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
};
