import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  user_id: string
  display_name: string
  xp: number
  level: number
  prestige: number
  current_streak: number
}

export function useProfile(user: User | null) {
  return useQuery({
    queryKey: ['profile', user?.id ?? 'guest'],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      return (data as Profile) ?? null
    },
    enabled: !!user,
    staleTime: 1000 * 30,
  })
}

export function useUpdateProfile(user: User | null) {
  const queryClient = useQueryClient()

  return async function update(fields: Partial<Omit<Profile, 'user_id' | 'display_name'>>) {
    if (!user) return
    await supabase.from('profiles').update(fields).eq('user_id', user.id)
    queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
  }
}
