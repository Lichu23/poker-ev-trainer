import { useState } from 'react'
import type { Scenario, PlayerAction, ActionEV, ScenarioResult } from '@/types/poker'
import {
  evFold,
  evCall,
  evBet,
  betAmountFromAction,
} from '@/lib/evCalculator'
import { getFoldFrequency } from '@/data/villainProfiles'
import { saveResult } from '@/lib/sessionStorage'

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

    default: {
      // all bet / raise actions
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
  chooseAction: (action: PlayerAction) => void
}

export function useScenario(scenario: Scenario): UseScenarioReturn {
  const [phase, setPhase] = useState<Phase>('decision')
  const [result, setResult] = useState<ScenarioResult | null>(null)

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
    setResult(r)
    setPhase('result')
  }

  return { phase, allEVs, result, chooseAction }
}
