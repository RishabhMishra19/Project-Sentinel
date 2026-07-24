import { MoonIcon, SunIcon } from '../../assets/icons'
import { useTheme } from './ThemeProvider'

type ThemeToggleProps = {
  className?: string
  variant?: 'menu' | 'icon'
}

export const ThemeToggle = ({ className = '', variant = 'menu' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const isIcon = variant === 'icon'
  const Icon = isDark ? SunIcon : MoonIcon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={
        isIcon
          ? `inline-flex size-9 items-center justify-center rounded border border-border bg-surface text-foreground hover:bg-background ${className}`
          : `inline-flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground ${className}`
      }
    >
      {isIcon ? (
        <Icon className="size-4" />
      ) : (
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded border border-border bg-surface text-foreground">
          <Icon className="size-3.5" />
        </span>
      )}
      {!isIcon && <span className="text-left leading-none">Toggle theme</span>}
    </button>
  )
}
