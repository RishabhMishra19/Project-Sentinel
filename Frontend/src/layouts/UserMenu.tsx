import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { User, Settings, LogOut } from "lucide-react";
import useUserMenu from "@/features/auth/hooks/useUserMenu";

export function UserMenu() {
  const { handleLogout, handleProfileClick } = useUserMenu();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-accent cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarFallback>R</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Hi,</span>
            <span className="text-sm font-medium">Rishabh</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
