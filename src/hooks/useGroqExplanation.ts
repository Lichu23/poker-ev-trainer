import { useQuery } from '@tanstack/react-query'
import type { Scenario, ScenarioResult } from '@/types/poker'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

function buildPrompt(scenario: Scenario, result: ScenarioResult): string {
  const board = scenario.board.join(' ')
  const hand = scenario.hand.join(' ')
  const villainAction = scenario.villainBetAmount
    ? `bet $${scenario.villainBetAmount}`
    : scenario.villainAction

  const evLines = result.allEVs
    .map(({ action, ev, isOptimal }) =>
      `${action.replaceAll('_', ' ')}: ${ev >= 0 ? '+' : ''}${ev.toFixed(1)}${isOptimal ? ' (optimal)' : ''}`
    )
    .join(' | ')

  const chosen = result.playerAction.replaceAll('_', ' ')
  const outcome = result.isCorrect ? 'CORRECT' : 'WRONG'

  return `You are a concise poker coach. Analyze this river decision:

Board: ${board} | Hand: ${hand} | ${scenario.position} vs ${scenario.villainType} (${villainAction}) | Pot: $${scenario.pot}
EVs: ${evLines}
Player chose: ${chosen} (EV: ${result.evChosen >= 0 ? '+' : ''}${result.evChosen.toFixed(1)}) — ${outcome}

Explain in 2 sentences max (280 characters max) why this decision was ${outcome.toLowerCase()}. Use specific numbers from the EVs. No filler phrases like "Great job" or "In this situation".`
}

async function fetchExplanation(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('missing key')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 80,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Groq ${res.status}`)

  const data = await res.json() as {
    choices: { message: { content: string } }[]
  }
  return data.choices[0].message.content.trim()
}

export function useGroqExplanation(scenario: Scenario, result: ScenarioResult | null) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  return useQuery({
    queryKey: ['groq', scenario.id, result?.playerAction ?? 'none'],
    queryFn: () => fetchExplanation(buildPrompt(scenario, result!)),
    enabled: result !== null && !!apiKey && apiKey !== 'your_groq_api_key_here',
    staleTime: Infinity,
    retry: 1,
  })
}
