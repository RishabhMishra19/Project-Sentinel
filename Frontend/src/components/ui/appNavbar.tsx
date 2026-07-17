import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/layouts/UserMenu";

export function AppNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Sentinel</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* ThemeToggle */}
        {/* Notifications */}
        {/* UserMenu */}
        <UserMenu />
      </div>
    </header>
  );
}
