import { useAuth } from '@/hooks/useAuth'
import { useResults, useResetResults } from '@/hooks/useResults'
import { useScenarios } from '@/hooks/useScenarios'
import { CategoryRow } from './CategoryRow'
import type { HandCategory } from '@/types/poker'

const CATEGORIES: HandCategory[] = ['nuts', 'strong_value', 'marginal', 'bluff_catcher', 'air']

function StatsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-surface-1 rounded-xl p-4 text-center animate-pulse">
            <div className="h-8 bg-surface-3 rounded w-14 mx-auto mb-2" />
            <div className="h-3 bg-surface-3 rounded w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-surface-1 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
        <div className="h-4 bg-surface-3 rounded w-40 mb-1" />
        {CATEGORIES.map((c) => (
          <div key={c} className="h-9 bg-surface-3 rounded-lg" />
        ))}
      </div>
    </>
  )
}

export function StatsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: results = [], isLoading, isFetching } = useResults(user)
  const { data: scenarios = [] } = useScenarios()
  const resetResults = useResetResults(user)

  const total = results.length
  const correct = results.filter((r) => r.isCorrect).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const totalEVLost = results.reduce((sum, r) => sum + r.evLost, 0)

  async function handleReset() {
    await resetResults()
  }

  return (
    <div className="min-h-full bg-gray-950 text-white px-4 py-8 max-w-xl md:max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stats</h1>
          {!authLoading && (
            <p className="text-xs text-gray-500 mt-1">
              {user ? 'All-time · synced to your account' : 'This session only · sign in to persist'}
            </p>
          )}
        </div>
        {isFetching && !isLoading && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
        )}
      </div>

      {authLoading || isLoading ? (
        <StatsSkeleton />
      ) : total === 0 ? (
        <p className="text-gray-500">No scenarios played yet. Go play some hands!</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-1 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Played</div>
            </div>
            <div className="bg-surface-1 rounded-xl p-4 text-center">
              <div
                className={`text-2xl font-bold ${
                  pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-white' : 'text-red-400'
                }`}
              >
                {pct}%
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Correct</div>
            </div>
            <div className="bg-surface-1 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 leading-tight">
                -{totalEVLost >= 100 ? Math.round(Math.abs(totalEVLost)) : Math.abs(totalEVLost).toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">EV Lost</div>
            </div>
          </div>

          <div className="bg-surface-1 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-base font-semibold text-gray-300 mb-1">Breakdown by category</div>
            {CATEGORIES.map((cat) => (
              <CategoryRow key={cat} category={cat} results={results} scenarios={scenarios} />
            ))}
          </div>
        </>
      )}

      <button
        onClick={handleReset}
        disabled={total === 0}
        className="bg-red-900 hover:bg-red-800 disabled:bg-surface-2 disabled:text-gray-600 disabled:cursor-not-allowed text-red-300 font-semibold py-4 rounded-lg transition-colors text-base"
      >
        Reset session
      </button>
    </div>
  )
}
