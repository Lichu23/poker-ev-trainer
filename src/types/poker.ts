export type Suit = 'h' | 'd' | 'c' | 's'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
export type Card = `${Rank}${Suit}`

export type Street = 'river'
export type Position = 'BTN' | 'SB' | 'BB' | 'CO' | 'MP' | 'UTG'
export type VillainType = 'nit' | 'tag' | 'lag' | 'fish'
export type VillainAction = 'check' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'overbet'
export type PlayerAction = 'fold' | 'check' | 'call' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'raise'
export type HandCategory = 'nuts' | 'strong_value' | 'marginal' | 'bluff_catcher' | 'air'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Scenario {
  id: number
  title: string
  difficulty: Difficulty
  street: Street
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

export interface ActionEV {
  action: PlayerAction
  betAmount?: number
  ev: number
  isOptimal: boolean
}

export interface ScenarioResult {
  scenarioId: number
  playerAction: PlayerAction
  playerBetAmount?: number
  evChosen: number
  evOptimal: number
  evLost: number
  isCorrect: boolean
  allEVs: ActionEV[]
  timestamp: number
}
