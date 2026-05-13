import { supabase } from './supabase'

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
}

export function signInWithGitHub() {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export function signOut() {
  return supabase.auth.signOut()
}
