import type { VillainType, VillainAction, HandCategory } from '@/types/poker'

export type HandCategoryWeights = Record<HandCategory, number>

export type VillainRange = Record<VillainAction, HandCategoryWeights>

export type VillainRanges = Record<VillainType, VillainRange>

// Weights represent the % of villain's range that falls into each hand category
// for a given villain type + action combination.
// Based on standard poker theory: tighter players have more value-heavy ranges when betting,
// looser players have more bluffs. All rows sum to 1.0.
export const VILLAIN_RANGES: VillainRanges = {
  nit: {
    // Nit checks: traps occasionally, mostly marginal/bluff-catchers, almost never air
    check:         { nuts: 0.15, strong_value: 0.20, marginal: 0.35, bluff_catcher: 0.25, air: 0.05 },
    // Nit bets small: thin value, some marginal — never bluffs
    bet_third:     { nuts: 0.25, strong_value: 0.45, marginal: 0.25, bluff_catcher: 0.05, air: 0.00 },
    bet_half:      { nuts: 0.35, strong_value: 0.45, marginal: 0.15, bluff_catcher: 0.05, air: 0.00 },
    bet_two_thirds:{ nuts: 0.45, strong_value: 0.40, marginal: 0.10, bluff_catcher: 0.05, air: 0.00 },
    bet_pot:       { nuts: 0.55, strong_value: 0.35, marginal: 0.05, bluff_catcher: 0.05, air: 0.00 },
    // Nit overbets: near-pure nuts
    overbet:       { nuts: 0.70, strong_value: 0.25, marginal: 0.05, bluff_catcher: 0.00, air: 0.00 },
  },

  tag: {
    // TAG checks: balanced — traps, marginal hands, bluff-catchers, minimal bluffs
    check:         { nuts: 0.10, strong_value: 0.25, marginal: 0.30, bluff_catcher: 0.25, air: 0.10 },
    // TAG bets small: thin value + some bluffs
    bet_third:     { nuts: 0.20, strong_value: 0.35, marginal: 0.20, bluff_catcher: 0.10, air: 0.15 },
    bet_half:      { nuts: 0.30, strong_value: 0.35, marginal: 0.15, bluff_catcher: 0.05, air: 0.15 },
    // TAG bets 2/3+: polarized — strong value + bluffs, little in between
    bet_two_thirds:{ nuts: 0.35, strong_value: 0.30, marginal: 0.10, bluff_catcher: 0.05, air: 0.20 },
    bet_pot:       { nuts: 0.40, strong_value: 0.25, marginal: 0.05, bluff_catcher: 0.05, air: 0.25 },
    // TAG overbets: highly polarized
    overbet:       { nuts: 0.50, strong_value: 0.20, marginal: 0.00, bluff_catcher: 0.00, air: 0.30 },
  },

  lag: {
    // LAG checks: traps more, also gives up with air more
    check:         { nuts: 0.15, strong_value: 0.20, marginal: 0.25, bluff_catcher: 0.25, air: 0.15 },
    // LAG bets small: very wide — lots of bluffs, thin value
    bet_third:     { nuts: 0.15, strong_value: 0.25, marginal: 0.20, bluff_catcher: 0.10, air: 0.30 },
    bet_half:      { nuts: 0.20, strong_value: 0.25, marginal: 0.15, bluff_catcher: 0.05, air: 0.35 },
    // LAG bets 2/3+: polarized with heavy bluff frequency
    bet_two_thirds:{ nuts: 0.25, strong_value: 0.25, marginal: 0.10, bluff_catcher: 0.05, air: 0.35 },
    bet_pot:       { nuts: 0.30, strong_value: 0.20, marginal: 0.05, bluff_catcher: 0.05, air: 0.40 },
    // LAG overbets: extremely polarized, half bluffs
    overbet:       { nuts: 0.35, strong_value: 0.20, marginal: 0.00, bluff_catcher: 0.00, air: 0.45 },
  },

  fish: {
    // Fish checks: mostly marginal/bluff-catchers (would've bet value, didn't bluff)
    check:         { nuts: 0.10, strong_value: 0.15, marginal: 0.35, bluff_catcher: 0.35, air: 0.05 },
    // Fish bets: almost always value, never bluffs — even small bets are mostly made hands
    bet_third:     { nuts: 0.20, strong_value: 0.40, marginal: 0.35, bluff_catcher: 0.05, air: 0.00 },
    bet_half:      { nuts: 0.30, strong_value: 0.45, marginal: 0.20, bluff_catcher: 0.05, air: 0.00 },
    bet_two_thirds:{ nuts: 0.40, strong_value: 0.45, marginal: 0.10, bluff_catcher: 0.05, air: 0.00 },
    bet_pot:       { nuts: 0.55, strong_value: 0.35, marginal: 0.10, bluff_catcher: 0.00, air: 0.00 },
    // Fish overbets: almost exclusively the nuts (they have no bluffing range)
    overbet:       { nuts: 0.70, strong_value: 0.20, marginal: 0.10, bluff_catcher: 0.00, air: 0.00 },
  },
}
