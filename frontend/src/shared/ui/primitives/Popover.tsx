import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type PopoverProps = {
  trigger: ReactElement<{
    onClick?: (event: React.MouseEvent) => void;
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
  }>;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type PanelPosition = {
  top: number;
  left: number;
};

export const Popover = ({
  trigger,
  children,
  align = "start",
  className,
  contentClassName,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (controlledOpen === undefined) {
        setUncontrolledOpen(next);
      }
    },
    [controlledOpen, onOpenChange],
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const panelEl = panelRef.current;
    if (!triggerEl || !panelEl) {
      return;
    }

    const triggerRect = triggerEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    const gap = 4;
    const viewportPadding = 8;

    let top = triggerRect.bottom + gap;
    if (top + panelRect.height > window.innerHeight - viewportPadding) {
      top = triggerRect.top - panelRect.height - gap;
    }
    top = Math.max(
      viewportPadding,
      Math.min(top, window.innerHeight - panelRect.height - viewportPadding),
    );

    let left = align === "end" ? triggerRect.right - panelRect.width : triggerRect.left;
    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - panelRect.width - viewportPadding),
    );

    setPosition({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [open, updatePosition, children]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onReposition = () => updatePosition();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, setOpen, updatePosition]);

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: (event: React.MouseEvent) => {
          trigger.props.onClick?.(event);
          setOpen(!open);
        },
      })
    : trigger;

  return (
    <div ref={triggerRef} className={`inline-flex ${className ?? ""}`}>
      {triggerNode}
      {open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              className={`fixed z-50 min-w-[10rem] rounded border border-border bg-surface p-2 shadow-md ${contentClassName ?? ""}`}
              style={{
                top: position?.top ?? -9999,
                left: position?.left ?? -9999,
                visibility: position ? "visible" : "hidden",
              }}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
