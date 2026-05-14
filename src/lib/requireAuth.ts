import { redirect } from '@tanstack/react-router'
import { supabase } from './supabase'

export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/' })
}
