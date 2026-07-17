import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppNavbar } from "@/components/ui/appNavbar";
import { AppSidebar } from "@/components/ui/appSideBar";

export default function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppNavbar />
        <main className="flex-1 overflow-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
