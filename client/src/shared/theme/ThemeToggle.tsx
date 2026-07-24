import { MoonIcon, SunIcon } from '../../assets/icons'
import { useTheme } from './ThemeProvider'

type ThemeToggleProps = {
  className?: string
}

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground ${className}`}
    >
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded border border-border bg-surface text-foreground">
        {isDark ? <SunIcon className="size-3.5" /> : <MoonIcon className="size-3.5" />}
      </span>
      <span className="text-left leading-none">Toggle theme</span>
    </button>
  )
}
