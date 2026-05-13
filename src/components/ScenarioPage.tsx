import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useScenarios } from '@/hooks/useScenarios'
import { ScenarioView } from './ScenarioView'

const routeApi = getRouteApi('/scenario/$id')

export function ScenarioPage() {
  const { id } = routeApi.useParams()
  const { difficulty, category } = routeApi.useSearch()
  const navigate = useNavigate()
  const { data: scenarios, isLoading } = useScenarios()

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-950 text-white flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading scenario…</div>
      </div>
    )
  }

  const all = scenarios ?? []
  const scenario = all.find((s) => s.id === Number(id))

  if (!scenario) {
    return (
      <div className="min-h-full bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Scenario not found.</div>
          <button
            onClick={() => navigate({ to: '/lobby' })}
            className="text-white underline underline-offset-4"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  function onNext() {
    const pool = all.filter((s) => {
      const diffOk = difficulty === 'all' || s.difficulty === difficulty
      const catOk = category === 'all' || s.handCategory === category
      return diffOk && catOk && s.id !== Number(id)
    })
    if (pool.length === 0) {
      navigate({ to: '/lobby' })
      return
    }
    const next = pool[Math.floor(Math.random() * pool.length)]
    navigate({
      to: '/scenario/$id',
      params: { id: String(next.id) },
      search: { difficulty, category },
    })
  }

  return <ScenarioView scenario={scenario} onNext={onNext} />
}
