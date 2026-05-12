import { Hand } from 'pokersolver'
import type { Card } from '@/types/poker'

export function evaluateHand(holeCards: Card[], board: Card[]): string {
  const hand = Hand.solve([...holeCards, ...board])
  return hand.name
}

export function getHandRank(holeCards: Card[], board: Card[]): number {
  const hand = Hand.solve([...holeCards, ...board])
  return hand.rank
}

// Returns 'player' | 'villain' | 'tie'
export function determineWinner(
  playerHand: Card[],
  villainHand: Card[],
  board: Card[],
): 'player' | 'villain' | 'tie' {
  const player = Hand.solve([...playerHand, ...board])
  const villain = Hand.solve([...villainHand, ...board])
  const winners = Hand.winners([player, villain])

  if (winners.length > 1) return 'tie'
  return winners[0] === player ? 'player' : 'villain'
}
