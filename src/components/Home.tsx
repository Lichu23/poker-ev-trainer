import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useScenarios } from '@/hooks/useScenarios'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { computeRank } from '@/lib/rankCalculator'
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
  })
}

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile } = useProfile(user)
  const { data: rank } = useMyRank(user?.id)
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
    <div className="h-full bg-gray-950 text-white flex flex-col items-center justify-center px-4 max-w-xl mx-auto">
      <div className="w-full flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Poker EV Trainer</h1>
          <p className="text-gray-400 text-base">Make the highest-EV decision on every river spot.</p>

          {profile && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5">
                <span className="text-gray-300 text-sm font-medium">{profile.display_name}</span>
                <span className="text-gray-600">·</span>
                <span className="text-green-400 text-sm font-semibold">
                  {(profile.prestige ?? 0) > 0 && <span className="text-yellow-400 mr-0.5">★</span>}
                  Lv.{profile.level ?? 1}
                </span>
                {rank && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-sm">{rank.badge} {rank.name}</span>
                  </>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide px-1">Difficulty</label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof ALL | Difficulty)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-xl pl-4 pr-10 py-4 focus:outline-none focus:border-green-600 appearance-none cursor-pointer"
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
                className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-xl pl-4 pr-10 py-4 focus:outline-none focus:border-green-600 appearance-none cursor-pointer"
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
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold text-lg rounded-xl py-5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading…' : 'Deal Hand'}
          </button>

        </div>
      </div>
    </div>
  )
}
