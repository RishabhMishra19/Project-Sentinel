import { ThemeToggle } from '../theme'
import { Breadcrumb } from './Breadcrumb'
import { usePageHeader } from './pageHeader'

export function AppNavbar() {
  const { crumbs } = usePageHeader()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
      <div className="min-w-0">
        <Breadcrumb items={crumbs} />
      </div>

      <ThemeToggle />
    </header>
  )
}
