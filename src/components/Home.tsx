import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { scenarios } from '@/data/scenarios'
import { ScenarioCard } from './ScenarioCard'
import type { Difficulty, HandCategory } from '@/types/poker'

const ALL = 'all'

export function Home() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState<typeof ALL | Difficulty>(ALL)
  const [category, setCategory] = useState<typeof ALL | HandCategory>(ALL)

  const filtered = scenarios.filter((s) => {
    const diffOk = difficulty === ALL || s.difficulty === difficulty
    const catOk = category === ALL || s.handCategory === category
    return diffOk && catOk
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 pt-8 pb-4 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-400 mb-1">Poker EV Trainer</h1>
        <p className="text-gray-400 text-base">Pick a river spot and make the highest-EV decision.</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide px-1">Difficulty</label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof ALL | Difficulty)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:border-green-600 appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide px-1">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof ALL | HandCategory)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-base rounded-lg pl-3 pr-8 py-3 focus:outline-none focus:border-green-600 appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="nuts">Nuts</option>
              <option value="strong_value">Strong value</option>
              <option value="marginal">Marginal</option>
              <option value="bluff_catcher">Bluff catcher</option>
              <option value="air">Air</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">{filtered.length} scenarios</div>

      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            onClick={() => navigate({ to: '/scenario/$id', params: { id: String(s.id) } })}
          />
        ))}
      </div>
    </div>
  )
}
