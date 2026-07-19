import { navigation } from "@/config/navigation";

import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";

interface SidebarNavProps {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-6">
      {navigation.map((group, index) => (
        <SidebarGroup key={index} title={collapsed ? undefined : group.title}>
          {group.items.map((item) => (
            <SidebarItem key={item.href} {...item} collapsed={collapsed} />
          ))}
        </SidebarGroup>
      ))}
    </nav>
  );
}
