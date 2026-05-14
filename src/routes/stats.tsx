import { createFileRoute } from '@tanstack/react-router'
import { StatsPage } from '@/components/StatsPage'
import { requireAuthOrGuest } from '@/lib/requireAuth'

export const Route = createFileRoute('/stats')({
  beforeLoad: requireAuthOrGuest,
  component: StatsPage,
})
