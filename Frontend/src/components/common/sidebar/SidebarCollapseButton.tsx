import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SidebarCollapseButtonProps {
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarCollapseButton({ collapsed = false, onClick }: SidebarCollapseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-full justify-center cursor-pointer"
      onClick={onClick}
    >
      {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
    </Button>
  );
}
