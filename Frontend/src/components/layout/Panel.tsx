import * as React from "react";
import { cn } from "@/lib/cn";
import { Surface } from "./Surface";

export type PanelProps = React.ComponentProps<typeof Surface>;

export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <Surface
      className={cn(
        "flex min-h-0 flex-col overflow-hidden transition-all duration-200 ease-out",
        className,
      )}
      {...props}
    >
      {children}
    </Surface>
  );
}
