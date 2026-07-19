import * as React from "react";
import { cn } from "@/lib/cn";

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function SidebarGroup({ title, children, className, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {title && (
        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}

      <div className="space-y-1">{children}</div>
    </div>
  );
}
