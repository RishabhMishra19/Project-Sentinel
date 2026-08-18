import { MoonIcon, SunIcon } from "../../assets/icons";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? SunIcon : MoonIcon;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <span className={className}>
      <span className="relative inline-flex">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={label}
          className="peer inline-flex size-9 items-center justify-center rounded-xl border border-border bg-chrome text-foreground hover:bg-background"
        >
          <Icon className="size-4" />
        </button>
        <span
          role="tooltip"
          className="pointer-events-none absolute top-full right-0 z-50 mt-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 peer-hover:opacity-100 peer-focus-visible:opacity-100"
        >
          {label}
        </span>
      </span>
    </span>
  );
};
