import { createFileRoute } from '@tanstack/react-router'
import { ScenarioPage } from '@/components/ScenarioPage'

export const Route = createFileRoute('/scenario/$id')({
  component: ScenarioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    difficulty: (search.difficulty as string) ?? 'all',
    category: (search.category as string) ?? 'all',
  }),
})
