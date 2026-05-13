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
      <span className="text-zinc-400 text-sm w-28 shrink-0 capitalize">{category.replace('_', ' ')}</span>
      <div className="flex-1 bg-surface-2 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-zinc-400 text-sm w-16 text-right shrink-0 font-mono">{pct}%</span>
    </div>
  )
}
