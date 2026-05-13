export interface RankTier {
  name: string
  badge: string
  maxEvLost: number
}

export const RANK_TIERS: RankTier[] = [
  { name: 'Elite',   badge: '💎', maxEvLost: 1.5  },
  { name: 'Pro',     badge: '♠',  maxEvLost: 4    },
  { name: 'Shark',   badge: '🦈', maxEvLost: 8    },
  { name: 'Regular', badge: '♣',  maxEvLost: 12   },
  { name: 'Fish',    badge: '🐟', maxEvLost: Infinity },
]

export function computeRank(avgEvLost: number, totalHands: number): RankTier | null {
  if (totalHands < 20) return null
  return RANK_TIERS.find(t => avgEvLost < t.maxEvLost) ?? RANK_TIERS[4]
}
