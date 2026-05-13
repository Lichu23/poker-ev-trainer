import type { Scenario } from '@/types/poker'
import { CardDisplay } from './CardDisplay'

interface Props {
  scenario: Scenario
  onClick: () => void
}

const DIFFICULTY_STYLES = {
  beginner:     'bg-surface-2 text-white',
  intermediate: 'bg-yellow-900 text-yellow-300',
  advanced:     'bg-red-900 text-red-300',
}

const CATEGORY_STYLES = {
  nuts:          'bg-purple-900 text-purple-300',
  strong_value:  'bg-blue-900 text-blue-300',
  marginal:      'bg-surface-3 text-zinc-300',
  bluff_catcher: 'bg-orange-900 text-orange-300',
  air:           'bg-pink-900 text-pink-300',
}

export function ScenarioCard({ scenario, onClick }: Props) {
  const { title, difficulty, handCategory, board, hand } = scenario

  return (
    <button
      onClick={onClick}
      className="bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-gray-500 rounded-xl p-4 text-left w-full transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-white font-semibold text-base leading-snug">{title}</span>
        <div className="flex flex-col gap-1 shrink-0 items-end">
          <span
            className={`${DIFFICULTY_STYLES[difficulty]} text-xs px-2 py-0.5 rounded-full font-medium`}
          >
            {difficulty}
          </span>
          <span
            className={`${CATEGORY_STYLES[handCategory]} text-xs px-2 py-0.5 rounded-full font-medium`}
          >
            {handCategory.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <div className="text-xs text-gray-500 mb-1">Board</div>
          <div className="flex gap-1">
            {board.map((card, i) => (
              <CardDisplay key={i} card={card} size="sm" />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Your hand</div>
          <div className="flex gap-1">
            {hand.map((card, i) => (
              <CardDisplay key={i} card={card} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}
