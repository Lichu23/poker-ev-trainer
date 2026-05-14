import type { Difficulty } from '@/types/poker'

export interface XPBreakdown {
  base: number
  correct: number
  precision: number
  streak: number
  total: number
}

export interface LevelInfo {
  level: number
  prestige: number
  currentXP: number
  xpForNext: number
  progressPct: number
}

const MULTIPLIER: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

const CORRECT_BONUS: Record<Difficulty, number> = {
  beginner: 15,
  intermediate: 30,
  advanced: 50,
}

const PRECISION_BONUS: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 10,
  advanced: 15,
}

export function computeXP(
  difficulty: Difficulty,
  isCorrect: boolean,
  evLost: number,
  currentStreak: number,
): XPBreakdown {
  if (!isCorrect) return { base: 0, correct: 0, precision: 0, streak: 0, total: 0 }
  const m = MULTIPLIER[difficulty]
  const base = 10 * m
  const correct = CORRECT_BONUS[difficulty]
  const precision = evLost < 2 ? PRECISION_BONUS[difficulty] : 0
  const streak = Math.min(currentStreak * 5, 25)
  return { base, correct, precision, streak, total: base + correct + precision + streak }
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1))
}

export function computeLevel(totalXP: number): LevelInfo {
  if (!totalXP || isNaN(totalXP) || totalXP <= 0) {
    return { level: 1, prestige: 0, currentXP: 0, xpForNext: xpForLevel(1), progressPct: 0 }
  }
  let remaining = totalXP
  let level = 1
  let prestige = 0

  while (true) {
    const needed = xpForLevel(level)
    if (remaining < needed) break
    remaining -= needed
    level++
    if (level > 100) {
      level = 1
      prestige++
    }
  }

  const xpForNext = xpForLevel(level)
  const progressPct = Math.round((remaining / xpForNext) * 100)
  return { level, prestige, currentXP: remaining, xpForNext, progressPct }
}
