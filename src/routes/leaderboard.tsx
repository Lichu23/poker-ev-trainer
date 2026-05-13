import { createFileRoute, redirect } from '@tanstack/react-router'
import { LeaderboardPage } from '@/components/LeaderboardPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/leaderboard')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/' })
  },
  component: LeaderboardPage,
})
