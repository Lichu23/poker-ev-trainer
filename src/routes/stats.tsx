import { createFileRoute } from '@tanstack/react-router'
import { StatsPage } from '@/components/StatsPage'
import { requireAuth } from '@/lib/requireAuth'

export const Route = createFileRoute('/stats')({
  beforeLoad: requireAuth,
  component: StatsPage,
})
