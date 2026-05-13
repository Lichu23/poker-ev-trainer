import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { BottomNav } from '@/components/BottomNav'

function PageWrapper() {
  const { location } = useRouterState()
  return (
    <div className="h-screen overflow-hidden bg-gray-950">
      <div
        key={location.pathname}
        className="h-full overflow-y-auto animate-page-in"
        style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </div>
      <BottomNav />
      <Analytics />
    </div>
  )
}

export const Route = createRootRoute({
  component: PageWrapper,
})
