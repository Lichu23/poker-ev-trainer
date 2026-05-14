import { createFileRoute } from '@tanstack/react-router'
import { ScenarioPage } from '@/components/ScenarioPage'
import { requireAuthOrGuest } from '@/lib/requireAuth'

export const Route = createFileRoute('/scenario/$id')({
  beforeLoad: requireAuthOrGuest,
  component: ScenarioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    difficulty: (search.difficulty as string) ?? 'all',
    category: (search.category as string) ?? 'all',
    street: (search.street as string) ?? 'all',
  }),
})
