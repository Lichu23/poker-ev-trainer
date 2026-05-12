import type { VillainType } from '@/types/poker'

type BetSizeKey = 'third' | 'half' | 'two_thirds' | 'pot' | 'overbet'

export const FOLD_FREQUENCIES: Record<VillainType, Record<BetSizeKey, number>> = {
  nit:  { third: 0.60, half: 0.68, two_thirds: 0.74, pot: 0.80, overbet: 0.85 },
  tag:  { third: 0.40, half: 0.48, two_thirds: 0.54, pot: 0.58, overbet: 0.50 },
  lag:  { third: 0.30, half: 0.37, two_thirds: 0.43, pot: 0.47, overbet: 0.44 },
  fish: { third: 0.14, half: 0.16, two_thirds: 0.20, pot: 0.23, overbet: 0.26 },
}

export function getFoldFrequency(villainType: VillainType, betSize: BetSizeKey): number {
  return FOLD_FREQUENCIES[villainType][betSize]
}
