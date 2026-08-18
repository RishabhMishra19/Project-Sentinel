import { buttonClassName, primaryButtonClassName } from "../styles";

type FilterPopoverActionsProps = {
  canReset: boolean;
  onReset: () => void;
  onApply: () => void;
};

export const FilterPopoverActions = ({ canReset, onReset, onApply }: FilterPopoverActionsProps) => (
  <div className="flex items-center justify-end gap-2 border-t border-border p-2">
    <button type="button" className={buttonClassName} onClick={onReset} disabled={!canReset}>
      Reset
    </button>
    <button type="button" className={primaryButtonClassName} onClick={onApply}>
      Apply
    </button>
  </div>
);
