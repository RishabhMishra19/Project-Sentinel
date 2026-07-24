import { Outlet } from 'react-router-dom'
import { AppNavbar } from './AppNavbar'
import { AppSidebar } from './AppSidebar'

export function ProtectedLayout() {
  return (
    <div className="flex min-h-screen gap-3 bg-chrome p-3">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        <AppNavbar />
        <main className="min-w-0 flex-1 overflow-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
