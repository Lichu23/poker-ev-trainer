import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface LeaderboardRow {
  user_id: string
  display_name: string
  total_hands: number
  avg_ev_lost: number
  correct_pct: number
}

function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardRow[]> => {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error) throw error
      return (data ?? []) as LeaderboardRow[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function LeaderboardPage() {
  const { user } = useAuth()
  const { data: rows = [], isLoading, isError } = useLeaderboard()

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
      <p className="text-gray-500 text-sm -mt-4">Ranked by avg EV lost · min 20 hands to appear</p>

      {isLoading && (
        <div className="text-gray-400 animate-pulse text-center py-12">Loading…</div>
      )}

      {isError && (
        <div className="text-red-400 text-sm text-center py-12">Failed to load leaderboard.</div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-500 text-sm">
          No players yet. Play 20+ hands to appear here.
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem_3.5rem] gap-x-3 px-4 py-3 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wide">
            <span>#</span>
            <span>Name</span>
            <span className="text-right">Hands</span>
            <span className="text-right">Correct</span>
            <span className="text-right">Avg EV</span>
          </div>

          {rows.map((row, i) => {
            const isMe = row.user_id === user?.id
            return (
              <div
                key={row.user_id}
                className={`grid grid-cols-[2rem_1fr_3.5rem_3.5rem_3.5rem] gap-x-3 px-4 py-3 border-b border-gray-800 last:border-0 text-sm transition-colors ${
                  isMe ? 'bg-green-950 text-green-300' : 'text-gray-300'
                }`}
              >
                <span className="text-gray-500 font-mono">{i + 1}</span>
                <span className="font-medium truncate">
                  {row.display_name}
                  {isMe && <span className="text-green-400 ml-1 text-xs">you</span>}
                </span>
                <span className="text-right text-gray-400">{row.total_hands}</span>
                <span className={`text-right font-mono ${row.correct_pct >= 70 ? 'text-green-400' : row.correct_pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {row.correct_pct}%
                </span>
                <span className="text-right font-mono text-red-400">
                  ${Number(row.avg_ev_lost).toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
