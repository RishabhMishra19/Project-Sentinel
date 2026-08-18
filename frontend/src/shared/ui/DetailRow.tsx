import type { ReactNode } from "react";

type DetailRowProps = {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  /**
   * `default` — compact view-modal rows.
   * `emphasized` — uppercase tracking labels (profile, detail panels).
   */
  variant?: "default" | "emphasized";
};

const labelClassName = {
  default: "text-xs text-muted",
  emphasized: "text-xs font-medium uppercase tracking-wide text-muted",
} as const;

const valueClassName = {
  default: "text-sm text-foreground",
  emphasized: "mt-1 break-all text-sm text-foreground",
} as const;

export const DetailRow = ({
  label,
  value,
  children,
  variant = "default",
}: DetailRowProps) => {
  const content = children ?? value;

  return (
    <div className={variant === "default" ? "flex flex-col gap-0.5" : "min-w-0"}>
      <dt className={labelClassName[variant]}>{label}</dt>
      <dd className={valueClassName[variant]}>{content}</dd>
    </div>
  );
};
