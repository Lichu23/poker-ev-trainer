export interface RankTier {
  name: string   // e.g. "Spade II"
  badge: string  // ♣ ♦ ♥ ♠
  maxEvLost: number
}

// Ordered best → worst (lower avg EV lost = better)
export const RANK_TIERS: RankTier[] = [
  { name: 'Spade I',    badge: '♠', maxEvLost: 0.5  },
  { name: 'Spade II',   badge: '♠', maxEvLost: 1.2  },
  { name: 'Spade III',  badge: '♠', maxEvLost: 2.5  },
  { name: 'Heart I',    badge: '♥', maxEvLost: 4    },
  { name: 'Heart II',   badge: '♥', maxEvLost: 6    },
  { name: 'Heart III',  badge: '♥', maxEvLost: 8    },
  { name: 'Diamond I',  badge: '♦', maxEvLost: 11   },
  { name: 'Diamond II', badge: '♦', maxEvLost: 14   },
  { name: 'Diamond III',badge: '♦', maxEvLost: 18   },
  { name: 'Club I',     badge: '♣', maxEvLost: 23   },
  { name: 'Club II',    badge: '♣', maxEvLost: 30   },
  { name: 'Club III',   badge: '♣', maxEvLost: Infinity },
]

export function computeRank(avgEvLost: number, totalHands: number): RankTier | null {
  if (totalHands < 20) return null
  return RANK_TIERS.find(t => avgEvLost < t.maxEvLost) ?? RANK_TIERS[RANK_TIERS.length - 1]
}
