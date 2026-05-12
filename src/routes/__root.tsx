import { Outlet, createRootRoute } from '@tanstack/react-router'
import { BottomNav } from '@/components/BottomNav'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </>
  ),
})
