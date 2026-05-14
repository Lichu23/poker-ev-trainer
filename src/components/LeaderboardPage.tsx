import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { computeRank } from '@/lib/rankCalculator'

interface LeaderboardRow {
  user_id: string
  display_name: string
  total_hands: number
  avg_ev_lost: number
  correct_pct: number
  level: number
  prestige: number
}

const MIN_HANDS = 10

function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardRow[]> => {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error) throw error
      return (data ?? []) as LeaderboardRow[]
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}

function LeaderboardSkeleton() {
  return (
    <div className="bg-surface-1 rounded-xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-3">
        <div className="h-3 bg-surface-3 rounded w-full" />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-surface-3 last:border-0">
          <div className="w-5 h-4 bg-surface-3 rounded shrink-0" />
          <div className="flex-1 h-4 bg-surface-3 rounded" />
          <div className="w-10 h-4 bg-surface-3 rounded shrink-0" />
          <div className="w-14 h-4 bg-surface-3 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

function useMyHandCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['my-hand-count', userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0
      const { count } = await supabase
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      return count ?? 0
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  })
}

function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
  if (medals[rank]) return <span className="text-base leading-none">{medals[rank]}</span>
  return <span className="text-gray-600 text-sm w-5 shrink-0 tabular-nums">{rank}</span>
}

export function LeaderboardPage() {
  const { user } = useAuth()
  const { data: rows = [], isLoading, isError } = useLeaderboard()
  const { data: myHandCount = 0 } = useMyHandCount(user?.id)
  const needsMoreHands = myHandCount < MIN_HANDS

  const MAX_SHOWN = 100
  const visibleRows = rows.slice(0, MAX_SHOWN)

  const myRankIndex = rows.findIndex(r => r.user_id === user?.id)
  const myRow = myRankIndex >= 0 ? rows[myRankIndex] : null
  const myRank = myRankIndex + 1
  const topPct = rows.length > 0 ? Math.ceil((myRank / rows.length) * 100) : null

  return (
    <div className="min-h-full bg-gray-950 text-white px-4 py-8 max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ranked by avg EV lost · min {MIN_HANDS} hands to appear
          {rows.length > 0 && <span className="ml-2 text-gray-600">· {rows.length} players</span>}
        </p>
      </div>

      {needsMoreHands && (
        <div className="bg-surface-1 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Your progress to appear</span>
            <span className="text-gray-400 font-mono">{myHandCount} / {MIN_HANDS}</span>
          </div>
          <div className="w-full bg-surface-3 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min((myHandCount / MIN_HANDS) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {MIN_HANDS - myHandCount} more hand{MIN_HANDS - myHandCount !== 1 ? 's' : ''} needed
          </p>
        </div>
      )}

      {isLoading && <LeaderboardSkeleton />}

      {isError && (
        <div className="text-red-400 text-sm text-center py-12">Failed to load leaderboard.</div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="bg-surface-1 rounded-xl p-6 text-center text-gray-500 text-sm">
          No players yet — be the first to reach {MIN_HANDS} hands.
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-surface-1 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-3 text-xs text-gray-500 uppercase tracking-wide">
            <span className="w-5 shrink-0">#</span>
            <span className="flex-1">Player</span>
            <span className="shrink-0 w-10 text-right">Corr</span>
            <span className="shrink-0 w-14 text-right">Avg EV</span>
          </div>

          {/* Rows — scrollable when list is long */}
          <div className="max-h-[480px] overflow-y-auto">
            {visibleRows.map((row, i) => {
              const isMe = row.user_id === user?.id
              const rank = computeRank(Number(row.avg_ev_lost), row.total_hands)
              return (
                <div
                  key={row.user_id}
                  className={[
                    'flex items-center gap-3 px-4 py-3 border-b border-surface-3 last:border-0 transition-colors',
                    isMe
                      ? 'bg-amber-950/30 border-l-2 border-l-amber-500'
                      : 'border-l-2 border-l-transparent',
                  ].join(' ')}
                >
                  <span className="w-5 shrink-0 flex items-center justify-center">
                    <RankBadge rank={i + 1} />
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-sm font-medium truncate text-white">
                      {row.display_name}
                    </span>
                    {rank && <span className="text-gray-500 text-xs shrink-0">{rank.badge}</span>}
                    {isMe && (
                      <span className="shrink-0 text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5 leading-none">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-mono shrink-0 w-10 text-right ${
                    row.correct_pct >= 70 ? 'text-white' : row.correct_pct >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {row.correct_pct}%
                  </span>
                  <span className="text-sm font-mono text-red-400 shrink-0 w-14 text-right">
                    ${Number(row.avg_ev_lost).toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
          {rows.length > MAX_SHOWN && (
            <div className="px-4 py-2.5 text-center text-xs text-gray-600 border-t border-surface-3">
              Showing top {MAX_SHOWN} of {rows.length} players
            </div>
          )}
        </div>
      )}

      {/* Your position summary — shown once you're on the board */}
      {myRow && topPct !== null && (
        <div className="bg-surface-1 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your position</p>
              <p className="text-white font-semibold">
                <span className="text-2xl font-bold text-amber-400">#{myRank}</span>
                <span className="text-gray-400 text-sm ml-2">of {rows.length} players</span>
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                topPct <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                topPct <= 33 ? 'bg-green-500/20 text-green-400' :
                topPct <= 66 ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                Top {topPct}%
              </span>
              <p className="text-xs text-gray-500 mt-1.5">
                {myRow.correct_pct}% correct · ${Number(myRow.avg_ev_lost).toFixed(1)} avg EV
              </p>
            </div>
          </div>

          {/* Percentile bar */}
          <div className="mt-3">
            <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  topPct <= 10 ? 'bg-yellow-400' :
                  topPct <= 33 ? 'bg-green-400' :
                  topPct <= 66 ? 'bg-blue-400' :
                  'bg-gray-500'
                }`}
                style={{ width: `${100 - topPct + 1}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>Better than {100 - topPct}% of players</span>
              <span>{rows.length - myRank} players ahead</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
