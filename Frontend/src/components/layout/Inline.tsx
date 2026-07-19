import * as React from "react";
import { cn } from "@/lib/cn";

type InlineGap = "xs" | "sm" | "md" | "lg" | "xl";
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

const gapMap: Record<InlineGap, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignMap: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: InlineGap;
  align?: Align;
  justify?: Justify;
}

export function Inline({
  gap = "md",
  align = "center",
  justify = "start",
  className,
  ...props
}: InlineProps) {
  return (
    <div
      className={cn("flex", gapMap[gap], alignMap[align], justifyMap[justify], className)}
      {...props}
    />
  );
}
