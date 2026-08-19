import { buttonClassName, inputClassName } from "../styles";
import type { ServerCursorPagination } from "../types";

type DataTableCursorPaginationProps = {
  cursorPagination: ServerCursorPagination;
};

export const DataTableCursorPaginationBar = ({
  cursorPagination,
}: DataTableCursorPaginationProps) => {
  const {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    onPageSizeChange,
    onNextPage,
    onPrevPage,
  } = cursorPagination;

  return (
    <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-chrome/100 px-3 py-2 text-sm text-muted dark:bg-white/8">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <span>Rows</span>
          <select
            className={inputClassName}
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClassName}
          disabled={!hasPreviousPage || !startCursor}
          onClick={() => onPrevPage(startCursor!)}
        >
          Prev
        </button>
        <button
          type="button"
          className={buttonClassName}
          disabled={!hasNextPage || !endCursor}
          onClick={() => onNextPage(endCursor!)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
