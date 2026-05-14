import { redirect } from '@tanstack/react-router'
import { supabase } from './supabase'

/** Requires a signed-in user. Guests are redirected to /. */
export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/' })
}

/** Requires a signed-in user OR guest mode. Used for gameplay routes. */
export async function requireAuthOrGuest() {
  const { data: { user } } = await supabase.auth.getUser()
  const isGuest = localStorage.getItem('guest-mode') === 'true'
  if (!user && !isGuest) throw redirect({ to: '/' })
}
