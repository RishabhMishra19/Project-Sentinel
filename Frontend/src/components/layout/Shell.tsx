import * as React from "react";
import { cn } from "@/lib/cn";
import { LAYOUT } from "@/constants/layout";

export interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function Shell({ sidebar, navbar, children, className, collapsed }: ShellProps) {
  return (
    <div
      className={cn(
        "grid h-screen bg-background p-4 transition-[grid-template-columns] duration-200 ease-out",
        className,
      )}
      style={{
        gridTemplateColumns: `${
          collapsed ? LAYOUT.sidebar.collapsedWidth : LAYOUT.sidebar.expandedWidth
        }px 1fr`,
        gap: LAYOUT.shell.gap,
      }}
    >
      {sidebar}

      <div className="flex min-w-0 flex-col overflow-hidden">
        {navbar}

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
