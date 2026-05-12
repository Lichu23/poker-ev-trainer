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
    case 'bet_third':      return Math.round(pot * 0.33)
    case 'bet_half':       return Math.round(pot * 0.5)
    case 'bet_two_thirds': return Math.round(pot * 0.67)
    case 'bet_pot':        return pot
    default:               return 0
  }
}

// Standard raise = 2.5× villain's bet
export function raiseAmountFromBet(villainBetAmount: number): number {
  return Math.round(villainBetAmount * 2.5)
}

// EV of raising when villain has bet.
// raiseAmount = your total chips in (2.5× villain's bet).
// If villain folds: you win pot + villainBetAmount (the current pot).
// If villain calls: showdown with pot + 2×raiseAmount.
export function evRaise(
  equity: number,
  pot: number,
  villainBetAmount: number,
  raiseAmount: number,
  foldFreq: number,
): number {
  const currentPot = pot + villainBetAmount
  const showdownPot = pot + 2 * raiseAmount
  const foldEV = currentPot
  const callEV = equity * showdownPot - (1 - equity) * raiseAmount
  return foldFreq * foldEV + (1 - foldFreq) * callEV
}
