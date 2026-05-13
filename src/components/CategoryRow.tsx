import type { HandCategory, ScenarioResult, Scenario } from '@/types/poker'

interface Props {
  category: HandCategory
  results: ScenarioResult[]
  scenarios: Scenario[]
}

export function CategoryRow({ category, results, scenarios }: Props) {
  const catResults = results.filter((r) => {
    const s = scenarios.find((s) => s.id === r.scenarioId)
    return s?.handCategory === category
  })

  if (catResults.length === 0) return null

  const correct = catResults.filter((r) => r.isCorrect).length
  const pct = Math.round((correct / catResults.length) * 100)

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-base w-28 shrink-0 capitalize">{category.replace('_', ' ')}</span>
      <div className="flex-1 bg-surface-3 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 70 ? 'bg-brand-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-400 text-base w-20 text-right shrink-0">
        {correct}/{catResults.length} ({pct}%)
      </span>
    </div>
  )
}
