import type { ReactNode } from "react";

type ChartShellProps = {
  title: string;
  xLabel: string;
  yLabel: string;
  children: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  /** Tailwind height class for the chart area. Default: h-64 */
  heightClassName?: string;
};

export const ChartShell = ({
  title,
  xLabel,
  yLabel,
  children,
  empty = false,
  emptyMessage = "No data in this range.",
  heightClassName = "h-64",
}: ChartShellProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {empty ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="flex gap-1">
          <div className="relative w-6 shrink-0 self-stretch">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs text-muted-foreground">
              {yLabel}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className={`w-full ${heightClassName}`}>{children}</div>
            <p className="text-center text-xs text-muted-foreground">{xLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
};
