import { useQuery } from '@tanstack/react-query'
import { supabase, rowToScenario } from '@/lib/supabase'
import type { Scenario } from '@/types/poker'

async function fetchScenarios(): Promise<Scenario[]> {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('id')

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToScenario)
}

export function useScenarios() {
  return useQuery<Scenario[]>({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
    staleTime: 1000 * 60 * 60, // 1 hour — data never changes at runtime
  })
}
