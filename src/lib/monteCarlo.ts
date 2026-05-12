import { Hand } from 'pokersolver'
import type { Card, Suit, Rank, VillainType, VillainAction, HandCategory } from '@/types/poker'
import { VILLAIN_RANGES } from '@/data/villainRanges'

const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
const SUITS: Suit[] = ['h','d','c','s']

function fullDeck(): Card[] {
  const deck: Card[] = []
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push(`${rank}${suit}` as Card)
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Returns the hand category of holeCards relative to a board using pokersolver rank.
// Thresholds are approximate and board-relative — good enough for range sampling.
function categorizeHand(holeCards: Card[], board: Card[]): HandCategory {
  const hand = Hand.solve([...holeCards, ...board])
  const rank: number = hand.rank

  // pokersolver ranks: 1=High Card, 2=Pair, 3=Two Pair, 4=Three of a Kind,
  // 5=Straight, 6=Flush, 7=Full House, 8=Four of a Kind, 9=Straight Flush
  if (rank >= 7) return 'nuts'            // Full house, quads, straight flush
  if (rank === 6 || rank === 5) return 'strong_value'  // Flush, straight
  if (rank === 4) return 'strong_value'   // Set
  if (rank === 3) return 'marginal'       // Two pair
  if (rank === 2) return 'bluff_catcher'  // One pair
  return 'air'                            // High card
}

// Pick a random category from weights using weighted random selection
function sampleCategory(weights: Record<HandCategory, number>): HandCategory {
  const rand = Math.random()
  let cumulative = 0
  const categories: HandCategory[] = ['nuts', 'strong_value', 'marginal', 'bluff_catcher', 'air']
  for (const cat of categories) {
    cumulative += weights[cat]
    if (rand < cumulative) return cat
  }
  return 'bluff_catcher'
}

// Draw villain hands from the available deck that match the target category.
// Tries up to maxAttempts random 2-card draws from the remaining deck.
function drawVillainHand(
  availableDeck: Card[],
  board: Card[],
  targetCategory: HandCategory,
  maxAttempts = 30,
): Card[] | null {
  const shuffled = shuffle(availableDeck)
  for (let i = 0; i < shuffled.length - 1 && i < maxAttempts * 2; i += 2) {
    const hand: Card[] = [shuffled[i], shuffled[i + 1]]
    if (categorizeHand(hand, board) === targetCategory) return hand
  }
  return null
}

/**
 * Monte Carlo equity calculator.
 *
 * Simulates `iterations` showdowns between playerHand and a villain hand
 * sampled from the villain's range (defined by villainType + villainAction).
 *
 * Returns equity as a fraction [0, 1]: percentage of time player wins.
 */
export function calculateEquityMonteCarlo(
  playerHand: Card[],
  board: Card[],
  villainType: VillainType,
  villainAction: VillainAction,
  iterations = 1000,
): number {
  const weights = VILLAIN_RANGES[villainType][villainAction]
  const usedCards = new Set([...playerHand, ...board])
  const baseDeck = fullDeck().filter(c => !usedCards.has(c))

  let wins = 0
  let ties = 0
  let simulated = 0

  for (let i = 0; i < iterations; i++) {
    const targetCategory = sampleCategory(weights)
    const villainHand = drawVillainHand(baseDeck, board, targetCategory)

    if (!villainHand) continue

    const player = Hand.solve([...playerHand, ...board])
    const villain = Hand.solve([...villainHand, ...board])
    const winners = Hand.winners([player, villain])

    simulated++
    if (winners.length > 1) {
      ties++
    } else if (winners[0] === player) {
      wins++
    }
  }

  if (simulated === 0) return 0.5
  return (wins + ties * 0.5) / simulated
}
