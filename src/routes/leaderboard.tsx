import { createFileRoute } from '@tanstack/react-router'
import { LeaderboardPage } from '@/components/LeaderboardPage'
import { requireAuth } from '@/lib/requireAuth'

export const Route = createFileRoute('/leaderboard')({
  beforeLoad: requireAuth,
  component: LeaderboardPage,
})
