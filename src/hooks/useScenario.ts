import { useState } from 'react'
import type { Scenario, PlayerAction, ActionEV, ScenarioResult } from '@/types/poker'
import {
  evFold,
  evCall,
  evBet,
  evRaise,
  betAmountFromAction,
  raiseAmountFromBet,
} from '@/lib/evCalculator'
import { getFoldFrequency } from '@/data/villainProfiles'
import { saveResult } from '@/lib/sessionStorage'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { computeXP, computeLevel } from '@/lib/xpCalculator'
import type { XPBreakdown, LevelInfo } from '@/lib/xpCalculator'

type Phase = 'decision' | 'result'

function betSizeKeyFromAction(action: PlayerAction): 'third' | 'half' | 'two_thirds' | 'pot' | 'overbet' {
  switch (action) {
    case 'bet_third':      return 'third'
    case 'bet_half':       return 'half'
    case 'bet_two_thirds': return 'two_thirds'
    case 'bet_pot':        return 'pot'
    case 'raise':          return 'overbet'
    default:               return 'pot'
  }
}

function computeEV(
  action: PlayerAction,
  scenario: Scenario,
): number {
  const { equity, pot, villainBetAmount, villainType } = scenario

  switch (action) {
    case 'fold':
      return evFold()

    case 'check':
      // villain already checked — both check back, showdown
      return equity * pot

    case 'call': {
      const callAmt = villainBetAmount ?? 0
      return evCall(equity, pot, callAmt)
    }

    case 'raise': {
      const villainBet = villainBetAmount ?? 0
      const raiseAmt = raiseAmountFromBet(villainBet)
      const foldFreq = getFoldFrequency(villainType, 'overbet')
      return evRaise(equity, pot, villainBet, raiseAmt, foldFreq)
    }

    default: {
      // bet_third / bet_half / bet_two_thirds / bet_pot
      const betAmt = betAmountFromAction(action, pot)
      const foldFreq = getFoldFrequency(villainType, betSizeKeyFromAction(action))
      return evBet(equity, pot, betAmt, foldFreq)
    }
  }
}

export function computeAllEVs(scenario: Scenario): ActionEV[] {
  const evs = scenario.availableActions.map((action) => ({
    action,
    ev: computeEV(action, scenario),
    isOptimal: false,
  }))

  const maxEV = Math.max(...evs.map((e) => e.ev))
  return evs.map((e) => ({ ...e, isOptimal: e.ev === maxEV }))
}

interface UseScenarioReturn {
  phase: Phase
  allEVs: ActionEV[]
  result: ScenarioResult | null
  xpBreakdown: XPBreakdown | null
  levelInfo: LevelInfo | null
  streak: number
  chooseAction: (action: PlayerAction) => void
}

export function useScenario(scenario: Scenario): UseScenarioReturn {
  const { user } = useAuth()
  const { data: profile } = useProfile(user)
  const updateProfile = useUpdateProfile(user)
  const [phase, setPhase] = useState<Phase>('decision')
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [xpBreakdown, setXpBreakdown] = useState<XPBreakdown | null>(null)
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [streak, setStreak] = useState(0)

  const allEVs = computeAllEVs(scenario)

  function chooseAction(action: PlayerAction) {
    const evChosen = allEVs.find((e) => e.action === action)!.ev
    const optimal = allEVs.find((e) => e.isOptimal)!
    const evOptimal = optimal.ev
    const evLost = Math.max(0, evOptimal - evChosen)
    const isCorrect = optimal.action === action

    const r: ScenarioResult = {
      scenarioId: scenario.id,
      playerAction: action,
      evChosen,
      evOptimal,
      evLost,
      isCorrect,
      allEVs,
      timestamp: Date.now(),
    }

    saveResult(r)

    if (user) {
      supabase.from('results').insert({
        user_id: user.id,
        scenario_id: scenario.id,
        player_action: action,
        ev_chosen: evChosen,
        ev_optimal: evOptimal,
        ev_lost: evLost,
        is_correct: isCorrect,
      }).then(({ error }) => {
        if (error) console.error('Failed to save result to DB:', error)
      })

      if (profile) {
        const newStreak = isCorrect ? (profile.current_streak ?? 0) + 1 : 0
        const breakdown = computeXP(scenario.difficulty, isCorrect, evLost, newStreak)
        const newTotalXP = (profile.xp ?? 0) + breakdown.total
        const newLevel = computeLevel(newTotalXP)

        setXpBreakdown(breakdown)
        setLevelInfo(newLevel)
        setStreak(newStreak)

        updateProfile({
          xp: newTotalXP,
          level: newLevel.level,
          prestige: newLevel.prestige,
          current_streak: newStreak,
        })
      }
    }

    setResult(r)
    setPhase('result')
  }

  return { phase, allEVs, result, xpBreakdown, levelInfo, streak, chooseAction }
}
