import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { scenarios } from '@/data/scenarios'
import { ScenarioView } from './ScenarioView'

const routeApi = getRouteApi('/scenario/$id')

export function ScenarioPage() {
  const { id } = routeApi.useParams()
  const navigate = useNavigate()
  const scenario = scenarios.find((s) => s.id === Number(id))

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Scenario not found.</div>
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-green-400 underline underline-offset-4"
          >
            ← Back to home
          </button>
        </div>
      </div>
    )
  }

  return <ScenarioView scenario={scenario} />
}
