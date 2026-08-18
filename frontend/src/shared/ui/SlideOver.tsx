import { useEffect, useId, useRef, type ReactNode } from "react";

const sizeClassName = {
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

const zIndexClassName = {
  50: "z-50",
  60: "z-[60]",
} as const;

export type SlideOverSize = keyof typeof sizeClassName;
export type SlideOverZIndex = keyof typeof zIndexClassName;

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

type SlideOverProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Small label above the title (e.g. feature name). */
  eyebrow?: ReactNode;
  children: ReactNode;
  size?: SlideOverSize;
  zIndex?: SlideOverZIndex;
  className?: string;
};

/**
 * Right-side panel shell: backdrop, dialog aside, header close, scrollable body.
 * Mirrors `ModalLayout` behavior (Escape, focus trap, restore focus).
 */
export const SlideOver = ({
  open,
  onClose,
  title,
  eyebrow,
  children,
  size = "lg",
  zIndex = 50,
  className,
}: SlideOverProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
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
        onCloseRef.current();
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
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex justify-end bg-foreground/40 ${zIndexClassName[zIndex]}`}
    >
      <button
        type="button"
        tabIndex={-1}
        className="flex-1 cursor-default"
        aria-label="Close dialog backdrop"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          "flex h-full w-full flex-col border-l border-border bg-surface shadow-lg outline-none",
          sizeClassName[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{eyebrow}</p>
            ) : null}
            <h2
              id={titleId}
              className={
                eyebrow
                  ? "mt-0.5 text-lg font-semibold tracking-tight text-foreground"
                  : "text-lg font-semibold tracking-tight text-foreground"
              }
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border px-2.5 py-1 text-sm text-foreground hover:bg-chrome"
          >
            Close
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
};
