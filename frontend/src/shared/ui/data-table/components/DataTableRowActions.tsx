import { useMemo } from "react";
import { Menu } from "../../primitives/Menu";
import { buttonClassName } from "../styles";
import type { RowAction } from "../types";

type DataTableRowActionsProps<T extends object> = {
  row: T;
  actions: RowAction<T>[];
};

export const DataTableRowActions = <T extends object>({
  row,
  actions,
}: DataTableRowActionsProps<T>) => {
  const visible = useMemo(() => actions.filter((action) => !action.hidden?.(row)), [actions, row]);

  if (visible.length === 0) {
    if (actions.length === 0) {
      return null;
    }
    return (
      <button type="button" className={buttonClassName} disabled>
        Actions
        <span aria-hidden="true">▾</span>
      </button>
    );
  }

  if (visible.length === 1) {
    const action = visible[0];
    const disabled = action.disabled?.(row) ?? false;
    const isDanger = action.variant === "danger";
    return (
      <button
        type="button"
        className={
          isDanger
            ? "inline-flex h-8 items-center gap-1.5 rounded border border-border bg-surface px-2.5 text-sm text-danger hover:bg-danger/10 disabled:opacity-50"
            : buttonClassName
        }
        disabled={disabled}
        onClick={() => action.onClick(row)}
      >
        {action.label}
      </button>
    );
  }

  return (
    <Menu
      trigger={
        <button type="button" className={buttonClassName}>
          Actions
          <span aria-hidden="true">▾</span>
        </button>
      }
      items={visible.map((action) => ({
        id: action.id,
        label: action.label,
        variant: action.variant,
        disabled: action.disabled?.(row),
        onSelect: () => action.onClick(row),
      }))}
    />
  );
};
