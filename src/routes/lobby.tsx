import { createFileRoute, redirect } from '@tanstack/react-router'
import { Home } from '@/components/Home'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/lobby')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const choseGuest = localStorage.getItem('guest-mode') === 'true'
    if (!user && !choseGuest) throw redirect({ to: '/' })
  },
  component: Home,
})
