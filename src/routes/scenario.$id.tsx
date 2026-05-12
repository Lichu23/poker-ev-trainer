import { createFileRoute } from '@tanstack/react-router'
import { ScenarioPage } from '@/components/ScenarioPage'

export const Route = createFileRoute('/scenario/$id')({
  component: ScenarioPage,
})
