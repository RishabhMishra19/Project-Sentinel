import { SidebarCollapseButton } from "./SidebarCollapseButton";

interface SidebarFooterProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export function SidebarFooter({ collapsed, onCollapse }: SidebarFooterProps) {
  return (
    <footer className="mt-auto border-t pt-3">
      <SidebarCollapseButton collapsed={collapsed} onClick={onCollapse} />
    </footer>
  );
}
