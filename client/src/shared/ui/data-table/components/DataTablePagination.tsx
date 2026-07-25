import { buttonClassName, inputClassName } from "../styles";
import type { DataTablePagination } from "../types";

type DataTablePaginationProps = {
  pagination: DataTablePagination;
};

export const DataTablePaginationBar = ({
  pagination,
}: DataTablePaginationProps) => {
  const {
    pageIndex,
    pageSize,
    totalElements,
    onPageIndexChange,
    onPageSizeChange,
  } = pagination;

  const pageCount = pageSize > 0 ? Math.ceil(totalElements / pageSize) : 0;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < pageCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-chrome/60 px-3 py-2 text-sm text-muted dark:bg-white/8">
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
        <span>{totalElements} total</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClassName}
          disabled={!canPrev}
          onClick={() => onPageIndexChange(pageIndex - 1)}
        >
          Prev
        </button>
        <span className="tabular-nums text-foreground">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </span>
        <button
          type="button"
          className={buttonClassName}
          disabled={!canNext}
          onClick={() => onPageIndexChange(pageIndex + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
