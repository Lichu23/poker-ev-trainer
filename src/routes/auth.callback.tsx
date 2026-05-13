import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = session.user
        const displayName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.user_metadata?.user_name ??
          user.email?.split('@')[0] ??
          'Player'

        await supabase.from('profiles').upsert(
          { user_id: user.id, display_name: displayName },
          { onConflict: 'user_id', ignoreDuplicates: true }
        )
        localStorage.removeItem('guest-mode')
      } else {
        const code = new URL(window.location.href).searchParams.get('code')
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        }
      }

      navigate({ to: '/lobby' })
    })
  }, [navigate])

  return (
    <div className="min-h-full bg-surface-0 flex items-center justify-center">
      <div className="text-zinc-500 animate-pulse">Signing in…</div>
    </div>
  )
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})
