import { AppShell } from "@/components/layout/AppShell";
import { Outlet } from "react-router-dom";

export default function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
