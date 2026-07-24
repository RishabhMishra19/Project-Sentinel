import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export function ProtectedLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-auto bg-surface px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
