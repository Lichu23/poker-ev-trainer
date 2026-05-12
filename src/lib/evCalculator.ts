import type { PlayerAction } from '@/types/poker'

export function evFold(): number {
  return 0
}

export function evCall(equity: number, pot: number, callAmount: number): number {
  const totalPot = pot + callAmount * 2
  return equity * totalPot - (1 - equity) * callAmount
}

export function requiredEquity(callAmount: number, pot: number): number {
  return callAmount / (pot + callAmount * 2)
}

export function evBet(
  equity: number,
  pot: number,
  betAmount: number,
  foldEquity: number,
): number {
  const showdownEV = equity * (pot + betAmount * 2) - (1 - equity) * betAmount
  return foldEquity * pot + (1 - foldEquity) * showdownEV
}

// Minimum fold % villain needs to have for a bluff to break even
export function alpha(betAmount: number, pot: number): number {
  return betAmount / (pot + betAmount)
}

export function betAmountFromAction(action: PlayerAction, pot: number): number {
  switch (action) {
    case 'bet_third': return Math.round(pot * 0.33)
    case 'bet_half': return Math.round(pot * 0.5)
    case 'bet_two_thirds': return Math.round(pot * 0.67)
    case 'bet_pot': return pot
    case 'raise': return Math.round(pot * 1.5)
    default: return 0
  }
}
