import { Shield } from "lucide-react";

import { Inline } from "@/components/layout/Inline";

export interface SidebarHeaderProps {
  collapsed?: boolean;
}

export function SidebarHeader({ collapsed = false }: SidebarHeaderProps) {
  return (
    <header className="flex items-center px-3 mb-6 pb-5">
      <Inline gap="md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>

        {!collapsed && (
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sentinel</h1>

            <p className="text-xs text-muted-foreground">API Monitoring</p>
          </div>
        )}
      </Inline>
    </header>
  );
}
