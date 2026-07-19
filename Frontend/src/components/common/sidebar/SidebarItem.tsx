import * as React from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { UI } from "@/constants/ui";

export interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  collapsed?: boolean;
  badge?: React.ReactNode;
}

export function SidebarItem({
  label,
  href,
  icon: Icon,
  collapsed = false,
  badge,
}: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          UI.transition.default,
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      {!collapsed && (
        <>
          <span
            className={cn(
              "ml-3 flex-1 truncate transition-all duration-200",
              collapsed && "w-0 opacity-0",
            )}
          >
            {label}
          </span>
          {badge}
        </>
      )}
    </NavLink>
  );
}
