import { Outlet, createRootRoute } from '@tanstack/react-router'
import { BottomNav } from '@/components/BottomNav'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-950">
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  ),
})
