import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useScenarios } from '@/hooks/useScenarios'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { computeRank } from '@/lib/rankCalculator'
import { computeLevel } from '@/lib/xpCalculator'
import { signOut } from '@/lib/auth'
import type { Difficulty, HandCategory } from '@/types/poker'

const ALL = 'all'

function useMyRank(userId: string | undefined) {
  return useQuery({
    queryKey: ['my-rank', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data } = await supabase
        .from('results')
        .select('ev_lost')
        .eq('user_id', userId)
      if (!data || data.length === 0) return null
      const avg = data.reduce((sum, r) => sum + Number(r.ev_lost), 0) / data.length
      return computeRank(avg, data.length)
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  })
}

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile(user)
  const { data: rank, isLoading: rankLoading } = useMyRank(user?.id)
  const { data: scenarios, isLoading, isError } = useScenarios()
  const [difficulty, setDifficulty] = useState<typeof ALL | Difficulty>(ALL)
  const [category, setCategory] = useState<typeof ALL | HandCategory>(ALL)

  const filtered = (scenarios ?? []).filter((s) => {
    const diffOk = difficulty === ALL || s.difficulty === difficulty
    const catOk = category === ALL || s.handCategory === category
    return diffOk && catOk
  })

  function dealHand() {
    if (filtered.length === 0) return
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    navigate({
      to: '/scenario/$id',
      params: { id: String(pick.id) },
      search: { difficulty, category },
    })
  }

  return (
    <div className="h-full bg-surface-0 text-white flex flex-col items-center justify-center px-4 max-w-xl mx-auto">
      <div className="w-full flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white  mb-2">Poker EV Trainer</h1>
          <p className="text-gray-400 text-base">Make the highest-EV decision on every river spot.</p>

          {user && (profileLoading || rankLoading) && (
            <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-700 rounded w-32" />
                <div className="h-4 bg-gray-700 rounded w-10" />
              </div>
              <div className="h-2 bg-gray-700 rounded w-full" />
            </div>
          )}

          {profile && !profileLoading && (() => {
            const levelInfo = computeLevel(profile.xp ?? 0)
            return (
              <div className="mt-3 bg-surface-1 border border-surface-3 rounded-xl px-3 py-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-white font-medium text-sm truncate">{profile.display_name}</span>
                    {rank && <span className="text-xs text-zinc-500 shrink-0">{rank.badge} {rank.name}</span>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {(profile.prestige ?? 0) > 0 && <span className="text-yellow-400 mr-0.5">★</span>}
                      Lv.{profile.level ?? 1}
                    </span>
                    <button onClick={() => signOut()} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-3 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${levelInfo.progressPct}%` }} />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0 font-mono">{levelInfo.currentXP}/{levelInfo.xpForNext}</span>
                </div>
              </div>
            )
          })()}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide px-1">Difficulty</label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof ALL | Difficulty)}
                className="w-full bg-surface-2 border border-surface-3 text-white text-base rounded-xl pl-4 pr-10 py-4 focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
              >
                <option value="all">All difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide px-1">Hand type</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof ALL | HandCategory)}
                className="w-full bg-surface-2 border border-surface-3 text-white text-base rounded-xl pl-4 pr-10 py-4 focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
              >
                <option value="all">All hand types</option>
                <option value="nuts">Nuts</option>
                <option value="strong_value">Strong value</option>
                <option value="marginal">Marginal</option>
                <option value="bluff_catcher">Bluff catcher</option>
                <option value="air">Air (bluff spots)</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {isError && (
          <p className="text-red-400 text-sm text-center">Failed to load scenarios. Check your connection.</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={dealHand}
            disabled={isLoading || filtered.length === 0}
            className="w-full bg-white hover:bg-brand-400 disabled:bg-surface-3 disabled:text-gray-500 text-gray-950 font-bold text-lg rounded-xl py-5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading…' : 'Deal Hand'}
          </button>

          <p className="text-zinc-600 text-xs text-center">
            Built by{' '}
            <a
              href="https://github.com/Lichu23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
            >
              @Lichu23
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
