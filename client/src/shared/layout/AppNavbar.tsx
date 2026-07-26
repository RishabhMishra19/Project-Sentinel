import { ThemeToggle } from '../theme'
import { Breadcrumb } from './Breadcrumb'
import { usePageHeader } from './pageHeader'

export function AppNavbar() {
  const { crumbs, description } = usePageHeader()

  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3">
      <div className="min-w-0">
        <Breadcrumb items={crumbs} />
        {description ? (
          <p className="mt-0.5 truncate text-xs text-muted">{description}</p>
        ) : null}
      </div>

      <ThemeToggle />
    </header>
  )
}
