import * as React from "react";
import { cn } from "@/lib/cn";
import { LAYOUT } from "@/constants/layout";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, style, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", className)}
      style={{
        maxWidth: LAYOUT.page.maxWidth,
        paddingInline: LAYOUT.page.padding,
        ...style,
      }}
      {...props}
    />
  );
}
