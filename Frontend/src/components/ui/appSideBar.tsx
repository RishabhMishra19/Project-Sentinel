// components/navigation/AppSidebar.tsx

import {
  Building2,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    url: "/organizations",
    icon: Building2,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Environments",
    url: "/environments",
    icon: ShieldCheck,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: KeyRound,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className=" border-sidebar-border">
        <div className="flex h-16 items-center px-4">
          <span className="text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                S
              </div>
              <span className="text-lg font-semibold">Sentinel</span>
            </div>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.url)}
                render={<Link to={item.url} />}
                className="
                  h-10 rounded-lg
                  text-sidebar-foreground
                  hover:bg-sidebar-accent
                  hover:text-sidebar-foreground

                  data-[active=true]:bg-primary
                  data-[active=true]:text-primary-foreground
                  data-[active=true]:font-medium
                  data-[active=true]:shadow-sm
                "
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-4 py-3 text-xs text-muted-foreground">Sentinel v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
