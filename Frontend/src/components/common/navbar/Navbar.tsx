import { Panel } from "@/components/layout/Panel";
import { Inline } from "@/components/layout/Inline";
import { UserMenu } from "@/layouts/UserMenu";
import { NavbarThemeToggler } from "./NavbarThemeToggler";

export interface NavbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Navbar({ left, right }: NavbarProps) {
  return (
    <Panel className="h-16 px-6">
      <Inline justify="between" className="h-full">
        <Inline gap="md">{left}</Inline>

        <Inline gap="sm">
          <NavbarThemeToggler />
          {right}
          <UserMenu />
        </Inline>
      </Inline>
    </Panel>
  );
}
