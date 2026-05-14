import { createFileRoute } from '@tanstack/react-router'
import { ScenarioPage } from '@/components/ScenarioPage'
import { requireAuth } from '@/lib/requireAuth'

export const Route = createFileRoute('/scenario/$id')({
  beforeLoad: requireAuth,
  component: ScenarioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    difficulty: (search.difficulty as string) ?? 'all',
    category: (search.category as string) ?? 'all',
    street: (search.street as string) ?? 'all',
  }),
})
