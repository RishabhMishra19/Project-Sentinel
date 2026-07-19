import * as React from "react";

import { Shell } from "@/components/layout/Shell";
import { Sidebar } from "../common/sidebar/Sidebar";
import { Navbar } from "../common/navbar/Navbar";

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, actions }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Shell
      collapsed={collapsed}
      sidebar={<Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((prev) => !prev)} />}
      navbar={<Navbar left={title} right={actions} />}
    >
      {children}
    </Shell>
  );
}
