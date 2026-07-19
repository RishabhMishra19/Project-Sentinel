import { FolderKanban, House, KeyRound, Settings, Shield, Users } from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const navigation: NavigationGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: House,
      },
      {
        label: "Organizations",
        href: "/organizations",
        icon: Shield,
      },
      {
        label: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
      {
        label: "API Keys",
        href: "/api-keys",
        icon: KeyRound,
      },
      {
        label: "Users",
        href: "/users",
        icon: Users,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
