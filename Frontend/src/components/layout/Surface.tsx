import * as React from "react";
import { UI } from "@/constants/ui";
import { cn } from "@/lib/cn";

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement>;

export function Surface({ className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn("border bg-card text-card-foreground shadow-sm", UI.radius.lg, className)}
      {...props}
    />
  );
}
