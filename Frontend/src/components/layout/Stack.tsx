import * as React from "react";
import { cn } from "@/lib/cn";

type StackGap = "xs" | "sm" | "md" | "lg" | "xl";

const gapMap: Record<StackGap, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: StackGap;
}

export function Stack({ gap = "md", className, ...props }: StackProps) {
  return <div className={cn("flex flex-col", gapMap[gap], className)} {...props} />;
}
