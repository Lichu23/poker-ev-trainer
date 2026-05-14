import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/components/Home'
import { requireAuthOrGuest } from '@/lib/requireAuth'

export const Route = createFileRoute('/lobby')({
  beforeLoad: requireAuthOrGuest,
  component: Home,
})
