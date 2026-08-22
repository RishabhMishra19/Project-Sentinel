import type { ReactNode } from "react";

type ChartShellProps = {
  title: string;
  xLabel: string;
  yLabel: string;
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  heightClassName?: string;
};

export const ChartShell = ({
  title,
  xLabel,
  yLabel,
  children,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyMessage = "No data in this range.",
  errorMessage = "something went wrong",
  heightClassName = "h-[150px]",
}: ChartShellProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-2 my-2 w-[49%]">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="flex gap-1">
        <div className="relative w-6 shrink-0 self-stretch">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs text-muted-foreground">
            {yLabel}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className={`w-full ${heightClassName} flex justify-center items-center`}>
            {isLoading ? (
              <p className={`text-sm text-muted`}>Loading...</p>
            ) : isError ? (
              <p className={`text-sm text-danger`}>{errorMessage}</p>
            ) : isEmpty ? (
              <p className={`text-sm text-muted`}>{emptyMessage}</p>
            ) : (
              <>{children}</>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">{xLabel}</p>
        </div>
      </div>
    </div>
  );
};
