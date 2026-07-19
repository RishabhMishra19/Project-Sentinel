import { Panel } from "@/components/layout/Panel";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  return (
    <Panel className="h-full p-3">
      <SidebarHeader collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} onCollapse={onCollapse} />
    </Panel>
  );
}
