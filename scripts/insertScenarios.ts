/**
 * Inserts generated scenarios into Supabase.
 * Run AFTER createTable.sql has been executed in the Supabase SQL Editor.
 * Run: npx tsx scripts/insertScenarios.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

interface GeneratedScenario {
  title: string
  difficulty: string
  street: string
  board: string[]
  hand: string[]
  position: string
  pot: number
  playerStack: number
  villainStack: number
  villainType: string
  villainAction: string
  villainBetAmount?: number
  handCategory: string
  equity: number
  availableActions: string[]
  explanation: string
}

async function main() {
  const raw = readFileSync('scripts/generated_scenarios.json', 'utf8')
  const scenarios: GeneratedScenario[] = JSON.parse(raw)

  // Map camelCase → snake_case to match the DB schema
  const rows = scenarios.map(s => ({
    title:              s.title,
    difficulty:         s.difficulty,
    street:             s.street,
    board:              s.board,
    hand:               s.hand,
    position:           s.position,
    pot:                s.pot,
    player_stack:       s.playerStack,
    villain_stack:      s.villainStack,
    villain_type:       s.villainType,
    villain_action:     s.villainAction,
    villain_bet_amount: s.villainBetAmount ?? null,
    hand_category:      s.handCategory,
    equity:             s.equity,
    available_actions:  s.availableActions,
    explanation:        s.explanation,
  }))

  // Insert in batches of 50 to stay well under Supabase limits
  const BATCH = 50
  let inserted = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('scenarios').insert(batch)

    if (error) {
      console.error(`\nError at batch ${i / BATCH + 1}:`, error.message)
      process.exit(1)
    }

    inserted += batch.length
    process.stdout.write(`\rInserted ${inserted}/${rows.length}`)
  }

  console.log(`\n✓ ${inserted} scenarios inserted into Supabase`)
}

main().catch(console.error)
