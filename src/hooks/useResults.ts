import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { loadResults, clearResults } from '@/lib/sessionStorage'
import type { ScenarioResult, PlayerAction } from '@/types/poker'

interface DBResultRow {
  id: number
  scenario_id: number
  player_action: string
  ev_chosen: number
  ev_optimal: number
  ev_lost: number
  is_correct: boolean
  created_at: string
}

function dbRowToResult(row: DBResultRow): ScenarioResult {
  return {
    scenarioId: row.scenario_id,
    playerAction: row.player_action as PlayerAction,
    evChosen: Number(row.ev_chosen),
    evOptimal: Number(row.ev_optimal),
    evLost: Number(row.ev_lost),
    isCorrect: row.is_correct,
    allEVs: [],
    timestamp: new Date(row.created_at).getTime(),
  }
}

export function useResults(user: User | null) {
  return useQuery({
    queryKey: ['results', user?.id ?? 'guest'],
    queryFn: async (): Promise<ScenarioResult[]> => {
      if (!user) return loadResults()
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map(dbRowToResult)
    },
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  })
}

export function useResetResults(user: User | null) {
  const queryClient = useQueryClient()

  return async function reset() {
    clearResults()
    if (user) {
      await supabase.from('results').delete().eq('user_id', user.id)
    }
    queryClient.invalidateQueries({ queryKey: ['results'] })
  }
}
