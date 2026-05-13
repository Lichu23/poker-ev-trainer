import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[auth/callback] mounted, url:', window.location.href)

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('[auth/callback] getSession →', { session, error })

      if (session?.user) {
        const user = session.user
        console.log('[auth/callback] user:', user.id, user.email)

        const displayName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.user_metadata?.user_name ??
          user.email?.split('@')[0] ??
          'Player'

        console.log('[auth/callback] upserting profile, displayName:', displayName)
        const { error: profileError } = await supabase.from('profiles').upsert(
          { user_id: user.id, display_name: displayName },
          { onConflict: 'user_id', ignoreDuplicates: true }
        )
        console.log('[auth/callback] profile upsert result:', { profileError })
      } else {
        console.warn('[auth/callback] no session — trying exchangeCodeForSession')
        const code = new URL(window.location.href).searchParams.get('code')
        console.log('[auth/callback] code param:', code)

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          console.log('[auth/callback] exchangeCodeForSession →', { data, exchangeError })
        }
      }

      console.log('[auth/callback] navigating to /lobby')
      navigate({ to: '/lobby' })
    })
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Signing in…</div>
    </div>
  )
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})
