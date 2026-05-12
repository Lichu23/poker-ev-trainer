/**
 * Scenario generator for Poker EV Trainer V2.
 * Run: npx tsx scripts/generateScenarios.ts
 * Output: scripts/generated_scenarios.json  (ready to insert into Supabase)
 */

import pokersolverPkg from 'pokersolver'
import { writeFileSync } from 'node:fs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Hand = (pokersolverPkg as any).Hand

// ── Types (inlined — no @/ aliases in Node scripts) ──────────────────────────

type Suit = 'h' | 'd' | 'c' | 's'
type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'T'|'J'|'Q'|'K'|'A'
type Card = `${Rank}${Suit}`
type VillainType = 'nit' | 'tag' | 'lag' | 'fish'
type VillainAction = 'check' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'overbet'
type PlayerAction = 'fold' | 'check' | 'call' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'raise'
type HandCategory = 'nuts' | 'strong_value' | 'marginal' | 'bluff_catcher' | 'air'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
type Position = 'BTN' | 'SB' | 'BB' | 'CO' | 'MP' | 'UTG'
type BoardTexture = 'rainbow' | 'two_tone' | 'monotone' | 'paired' | 'connected'
type HandCategoryWeights = Record<HandCategory, number>

interface GeneratedScenario {
  title: string
  difficulty: Difficulty
  street: 'river'
  board: Card[]
  hand: Card[]
  position: Position
  pot: number
  playerStack: number
  villainStack: number
  villainType: VillainType
  villainAction: VillainAction
  villainBetAmount?: number
  handCategory: HandCategory
  equity: number
  availableActions: PlayerAction[]
  explanation: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
const SUITS: Suit[] = ['h','d','c','s']
const POSITIONS: Position[] = ['BTN', 'CO', 'SB', 'BB', 'MP', 'UTG']
const HAND_CATEGORIES: HandCategory[] = ['nuts', 'strong_value', 'marginal', 'bluff_catcher', 'air']
const BOARD_TEXTURES: BoardTexture[] = ['rainbow', 'two_tone', 'monotone', 'paired', 'connected']
const POT_SIZES = [60, 80, 100, 120, 150, 200]

const TARGET_COUNT: Record<VillainType, number> = { nit: 75, tag: 125, lag: 125, fish: 75 }

const VILLAIN_ACTIONS: Record<VillainType, VillainAction[]> = {
  nit:  ['check', 'bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot'],
  tag:  ['check', 'bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot', 'overbet'],
  lag:  ['check', 'bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot', 'overbet'],
  fish: ['check', 'bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot'],
}

const BET_FRACTION: Record<VillainAction, number> = {
  check: 0, bet_third: 0.33, bet_half: 0.50,
  bet_two_thirds: 0.67, bet_pot: 1.00, overbet: 1.50,
}

// Villain range weights per type × action (mirrors src/data/villainRanges.ts)
const VILLAIN_RANGES: Record<VillainType, Record<VillainAction, HandCategoryWeights>> = {
  nit: {
    check:          { nuts: 0.15, strong_value: 0.20, marginal: 0.35, bluff_catcher: 0.25, air: 0.05 },
    bet_third:      { nuts: 0.25, strong_value: 0.45, marginal: 0.25, bluff_catcher: 0.05, air: 0.00 },
    bet_half:       { nuts: 0.35, strong_value: 0.45, marginal: 0.15, bluff_catcher: 0.05, air: 0.00 },
    bet_two_thirds: { nuts: 0.45, strong_value: 0.40, marginal: 0.10, bluff_catcher: 0.05, air: 0.00 },
    bet_pot:        { nuts: 0.55, strong_value: 0.35, marginal: 0.05, bluff_catcher: 0.05, air: 0.00 },
    overbet:        { nuts: 0.70, strong_value: 0.25, marginal: 0.05, bluff_catcher: 0.00, air: 0.00 },
  },
  tag: {
    check:          { nuts: 0.10, strong_value: 0.25, marginal: 0.30, bluff_catcher: 0.25, air: 0.10 },
    bet_third:      { nuts: 0.20, strong_value: 0.35, marginal: 0.20, bluff_catcher: 0.10, air: 0.15 },
    bet_half:       { nuts: 0.30, strong_value: 0.35, marginal: 0.15, bluff_catcher: 0.05, air: 0.15 },
    bet_two_thirds: { nuts: 0.35, strong_value: 0.30, marginal: 0.10, bluff_catcher: 0.05, air: 0.20 },
    bet_pot:        { nuts: 0.40, strong_value: 0.25, marginal: 0.05, bluff_catcher: 0.05, air: 0.25 },
    overbet:        { nuts: 0.50, strong_value: 0.20, marginal: 0.00, bluff_catcher: 0.00, air: 0.30 },
  },
  lag: {
    check:          { nuts: 0.15, strong_value: 0.20, marginal: 0.25, bluff_catcher: 0.25, air: 0.15 },
    bet_third:      { nuts: 0.15, strong_value: 0.25, marginal: 0.20, bluff_catcher: 0.10, air: 0.30 },
    bet_half:       { nuts: 0.20, strong_value: 0.25, marginal: 0.15, bluff_catcher: 0.05, air: 0.35 },
    bet_two_thirds: { nuts: 0.25, strong_value: 0.25, marginal: 0.10, bluff_catcher: 0.05, air: 0.35 },
    bet_pot:        { nuts: 0.30, strong_value: 0.20, marginal: 0.05, bluff_catcher: 0.05, air: 0.40 },
    overbet:        { nuts: 0.35, strong_value: 0.20, marginal: 0.00, bluff_catcher: 0.00, air: 0.45 },
  },
  fish: {
    check:          { nuts: 0.10, strong_value: 0.15, marginal: 0.35, bluff_catcher: 0.35, air: 0.05 },
    bet_third:      { nuts: 0.20, strong_value: 0.40, marginal: 0.35, bluff_catcher: 0.05, air: 0.00 },
    bet_half:       { nuts: 0.30, strong_value: 0.45, marginal: 0.20, bluff_catcher: 0.05, air: 0.00 },
    bet_two_thirds: { nuts: 0.40, strong_value: 0.45, marginal: 0.10, bluff_catcher: 0.05, air: 0.00 },
    bet_pot:        { nuts: 0.55, strong_value: 0.35, marginal: 0.10, bluff_catcher: 0.00, air: 0.00 },
    overbet:        { nuts: 0.70, strong_value: 0.20, marginal: 0.10, bluff_catcher: 0.00, air: 0.00 },
  },
}

// ── Deck utilities ────────────────────────────────────────────────────────────

function fullDeck(): Card[] {
  const deck: Card[] = []
  for (const r of RANKS) for (const s of SUITS) deck.push(`${r}${s}` as Card)
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

// ── Board generation ──────────────────────────────────────────────────────────

function generateBoard(texture: BoardTexture, seed: number): Card[] {
  // Re-shuffle per seed to get variety across repeated calls for same texture
  const deck = shuffle(fullDeck())

  switch (texture) {
    case 'rainbow': {
      const picked: Card[] = []
      const suitCount: Record<string, number> = {}
      for (const card of deck) {
        const suit = card[card.length - 1]
        if ((suitCount[suit] ?? 0) < 2) {
          suitCount[suit] = (suitCount[suit] ?? 0) + 1
          picked.push(card)
          if (picked.length === 5) break
        }
      }
      return picked.length === 5 ? picked : deck.slice(0, 5)
    }

    case 'two_tone': {
      const suit = SUITS[seed % 4]
      const ofSuit = shuffle(deck.filter(c => c.endsWith(suit))).slice(0, 3)
      const notSuit = shuffle(deck.filter(c => !c.endsWith(suit))).slice(0, 2)
      return [...ofSuit, ...notSuit]
    }

    case 'monotone': {
      const suit = SUITS[seed % 4]
      const ofSuit = shuffle(deck.filter(c => c.endsWith(suit))).slice(0, 4)
      const other = deck.find(c => !c.endsWith(suit))!
      return [...ofSuit, other]
    }

    case 'paired': {
      const rank = RANKS[seed % 13]
      const ofRank = shuffle(deck.filter(c => c.startsWith(rank))).slice(0, 2)
      const rest = shuffle(deck.filter(c => !c.startsWith(rank))).slice(0, 3)
      return [...ofRank, ...rest]
    }

    case 'connected': {
      const startIdx = seed % 9
      const r1 = RANKS[startIdx], r2 = RANKS[startIdx + 1], r3 = RANKS[startIdx + 2]
      const card1 = shuffle(deck.filter(c => c.startsWith(r1)))[0]
      const card2 = shuffle(deck.filter(c => c.startsWith(r2)))[0]
      const card3 = shuffle(deck.filter(c => c.startsWith(r3)))[0]
      const rest = shuffle(deck.filter(c =>
        !c.startsWith(r1) && !c.startsWith(r2) && !c.startsWith(r3)
      )).slice(0, 2)
      return [card1, card2, card3, ...rest]
    }
  }
}

// ── Hand categorization (pokersolver rank → HandCategory) ────────────────────

// Returns true only if no possible 2-card villain hand can beat holeCards on this board.
function isActualNuts(holeCards: Card[], board: Card[]): boolean {
  const playerStrength = Hand.solve([...holeCards, ...board].map(String))
  const used = new Set([...holeCards, ...board])
  const available = fullDeck().filter(c => !used.has(c))

  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      const villainStrength = Hand.solve([available[i], available[j], ...board].map(String))
      const winners = Hand.winners([playerStrength, villainStrength])
      if (winners.length === 1 && winners[0] !== playerStrength) return false
    }
  }
  return true
}

function categorizeHand(holeCards: Card[], board: Card[]): HandCategory {
  // pokersolver ranks: 1=High Card 2=Pair 3=Two Pair 4=Three of a Kind
  //                   5=Straight 6=Flush 7=Full House 8=Quads 9=Straight Flush
  const hand = Hand.solve([...holeCards, ...board].map(String))
  const rank: number = hand.rank
  // For full house and above, verify no villain hand can beat us before labeling nuts
  if (rank >= 7) return isActualNuts(holeCards, board) ? 'nuts' : 'strong_value'
  if (rank >= 5) return 'strong_value'   // straight or flush
  if (rank === 4) return 'strong_value'  // set
  if (rank === 3) return 'marginal'      // two pair
  if (rank === 2) return 'bluff_catcher' // one pair
  return 'air'
}

// ── Hand sampling ─────────────────────────────────────────────────────────────

function sampleHand(board: Card[], target: HandCategory, maxAttempts = 150): Card[] | null {
  const used = new Set(board)
  for (let i = 0; i < maxAttempts; i++) {
    const available = shuffle(fullDeck().filter(c => !used.has(c)))
    const hand: Card[] = [available[0], available[1]]
    if (categorizeHand(hand, board) === target) return hand
  }
  return null
}

// ── Monte Carlo equity ────────────────────────────────────────────────────────

function sampleCategory(weights: HandCategoryWeights): HandCategory {
  const rand = Math.random()
  let cumulative = 0
  for (const cat of HAND_CATEGORIES) {
    cumulative += weights[cat]
    if (rand < cumulative) return cat
  }
  return 'bluff_catcher'
}

function calculateEquity(
  playerHand: Card[],
  board: Card[],
  villainType: VillainType,
  villainAction: VillainAction,
  iterations = 800,
): number {
  const weights = VILLAIN_RANGES[villainType][villainAction]
  const usedCards = new Set([...playerHand, ...board])
  const baseDeck = fullDeck().filter(c => !usedCards.has(c))

  let wins = 0, ties = 0, simulated = 0

  for (let i = 0; i < iterations; i++) {
    const targetCat = sampleCategory(weights)
    const shuffled = shuffle(baseDeck)

    let villainHand: Card[] | null = null
    for (let j = 0; j + 1 < shuffled.length; j += 2) {
      const candidate: Card[] = [shuffled[j], shuffled[j + 1]]
      if (categorizeHand(candidate, board) === targetCat) {
        villainHand = candidate
        break
      }
    }
    if (!villainHand) continue

    const pHand = Hand.solve([...playerHand, ...board].map(String))
    const vHand = Hand.solve([...villainHand, ...board].map(String))
    const winners = Hand.winners([pHand, vHand])

    simulated++
    if (winners.length > 1) ties++
    else if (winners[0] === pHand) wins++
  }

  return simulated === 0 ? 0.5 : Math.round(((wins + ties * 0.5) / simulated) * 100) / 100
}

// ── Scenario metadata helpers ─────────────────────────────────────────────────

function toDifficulty(category: HandCategory): Difficulty {
  if (category === 'nuts' || category === 'air') return 'beginner'
  if (category === 'marginal') return 'advanced'
  return 'intermediate'
}

function toAvailableActions(villainAction: VillainAction): PlayerAction[] {
  return villainAction === 'check'
    ? ['check', 'bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot']
    : ['fold', 'call', 'raise']
}

const CAT_LABEL: Record<HandCategory, string> = {
  nuts: 'Nut Hand', strong_value: 'Strong Value', marginal: 'Marginal Hand',
  bluff_catcher: 'Bluff Catcher', air: 'Bluff Spot',
}
const ACTION_LABEL: Record<VillainAction, string> = {
  check: 'Checks', bet_third: 'Bets 1/3', bet_half: 'Bets 1/2',
  bet_two_thirds: 'Bets 2/3', bet_pot: 'Bets Pot', overbet: 'Overbets',
}

function toTitle(category: HandCategory, villainType: VillainType, action: VillainAction): string {
  return `${CAT_LABEL[category]} — ${villainType.toUpperCase()} ${ACTION_LABEL[action]}`
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const scenarios: GeneratedScenario[] = []
  let counter = 0

  for (const villainType of ['nit', 'tag', 'lag', 'fish'] as VillainType[]) {
    const actions = VILLAIN_ACTIONS[villainType]
    const target = TARGET_COUNT[villainType]
    const combos = actions.length * HAND_CATEGORIES.length
    const perCombo = Math.ceil(target / combos)

    let generated = 0
    let skipped = 0

    process.stdout.write(`\n${villainType.toUpperCase()} (${target} target): `)

    for (const action of actions) {
      for (const category of HAND_CATEGORIES) {
        if (generated >= target) break

        const count = Math.min(perCombo, target - generated)
        for (let i = 0; i < count; i++) {
          // Try up to 5 different boards before giving up on this slot
          let hand: Card[] | null = null
          let board: Card[] = []
          for (let retry = 0; retry < 5; retry++) {
            const texture = BOARD_TEXTURES[(counter + retry) % BOARD_TEXTURES.length]
            board = generateBoard(texture, counter + retry)
            hand = sampleHand(board, category)
            if (hand) break
          }

          if (!hand) {
            skipped++
            continue
          }

          const pot = POT_SIZES[counter % POT_SIZES.length]
          const playerStack = pot * 3
          const betFrac = BET_FRACTION[action]
          const villainBetAmount = action !== 'check' ? Math.round(pot * betFrac) : undefined
          const equity = calculateEquity(hand, board, villainType, action)

          scenarios.push({
            title: toTitle(category, villainType, action),
            difficulty: toDifficulty(category),
            street: 'river',
            board,
            hand,
            position: POSITIONS[counter % POSITIONS.length],
            pot,
            playerStack,
            villainStack: playerStack,
            villainType,
            villainAction: action,
            villainBetAmount,
            handCategory: category,
            equity,
            availableActions: toAvailableActions(action),
            explanation: '',
          })

          counter++
          generated++
          if (generated % 10 === 0) process.stdout.write('█')
        }
      }
    }

    console.log(` ${generated} generated, ${skipped} skipped`)
  }

  writeFileSync(
    'scripts/generated_scenarios.json',
    JSON.stringify(scenarios, null, 2),
  )

  console.log(`\n✓ ${scenarios.length} scenarios → scripts/generated_scenarios.json`)
}

main().catch(console.error)
