import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/components/Home'
import { requireAuth } from '@/lib/requireAuth'

export const Route = createFileRoute('/lobby')({
  beforeLoad: requireAuth,
  component: Home,
})
