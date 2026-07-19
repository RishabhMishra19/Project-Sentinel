import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: React.ReactNode;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}
