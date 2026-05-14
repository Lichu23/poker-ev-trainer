import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { BottomNav } from '@/components/BottomNav'

function PageWrapper() {
  const { location } = useRouterState()
  const isOnboarding = location.pathname === '/' || location.pathname.startsWith('/auth')

  return (
    <div className={`h-screen overflow-hidden bg-gray-950 ${isOnboarding ? '' : 'md:pl-56'}`}>
      <div
        key={location.pathname}
        className={`h-full overflow-y-auto animate-page-in ${isOnboarding ? '' : 'page-content'}`}
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
