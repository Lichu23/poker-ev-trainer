import { createClient } from '@supabase/supabase-js'
import type { Scenario } from '@/types/poker'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

// DB row uses snake_case — map to the app's camelCase Scenario type
export function rowToScenario(row: Record<string, unknown>): Scenario {
  return {
    id:               row.id as number,
    title:            row.title as string,
    difficulty:       row.difficulty as Scenario['difficulty'],
    street:           row.street as Scenario['street'],
    board:            row.board as Scenario['board'],
    hand:             row.hand as Scenario['hand'],
    position:         row.position as Scenario['position'],
    pot:              row.pot as number,
    playerStack:      row.player_stack as number,
    villainStack:     row.villain_stack as number,
    villainType:      row.villain_type as Scenario['villainType'],
    villainAction:    row.villain_action as Scenario['villainAction'],
    villainBetAmount: row.villain_bet_amount as number | undefined,
    handCategory:     row.hand_category as Scenario['handCategory'],
    equity:           row.equity as number,
    availableActions: row.available_actions as Scenario['availableActions'],
    explanation:      row.explanation as string,
  }
}
