import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { BottomNav } from '@/components/BottomNav'

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen overflow-hidden bg-surface-0">
      <div className="h-full pb-16 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
      <Analytics />
    </div>
  ),
})
