import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  children: ReactNode;
  /** `grid` — two-column field layout; `stack` — single-column list. */
  layout?: "grid" | "stack";
};

const layoutClassName = {
  grid: "grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4",
  stack: "flex flex-col gap-4 rounded-xl border border-border p-4",
} as const;

/**
 * Titled detail block with a bordered definition list for view/slide-over panels.
 */
export const DetailSection = ({ title, children, layout = "grid" }: DetailSectionProps) => {
  return (
    <section>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <dl className={layoutClassName[layout]}>{children}</dl>
    </section>
  );
};
