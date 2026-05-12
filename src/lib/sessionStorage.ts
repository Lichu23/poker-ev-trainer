import type { ScenarioResult } from '@/types/poker'

const KEY = 'poker-ev-trainer:results'

export function loadResults(): ScenarioResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ScenarioResult[]) : []
  } catch {
    return []
  }
}

export function saveResult(result: ScenarioResult): void {
  const existing = loadResults()
  localStorage.setItem(KEY, JSON.stringify([...existing, result]))
}

export function clearResults(): void {
  localStorage.removeItem(KEY)
}
