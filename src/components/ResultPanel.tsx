import type { ScenarioResult } from '@/types/poker'
import { EVBar } from './EVBar'

interface Props {
  result: ScenarioResult
  explanation: string
  isLoadingExplanation?: boolean
  onNext: () => void
}

export function ResultPanel({ result, explanation, isLoadingExplanation = false, onNext }: Props) {
  const { isCorrect, evChosen, evOptimal, evLost, allEVs } = result

  return (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-5 w-full">
      <div
        className={`text-xl font-bold text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
      >
        {isCorrect ? '✓ Correct!' : '✗ Not optimal'}
      </div>

      <div className="flex justify-around text-center">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Your EV</div>
          <div
            className={`text-2xl font-bold ${evChosen >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {evChosen >= 0 ? '+' : ''}{evChosen.toFixed(1)}
          </div>
        </div>
        {!isCorrect && (
          <>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Optimal EV</div>
              <div className="text-2xl font-bold text-green-400">
                +{evOptimal.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">EV Lost</div>
              <div className="text-2xl font-bold text-red-400">
                -{evLost.toFixed(1)}
              </div>
            </div>
          </>
        )}
      </div>

      <EVBar evs={allEVs} />

      <div className="border-t border-gray-700 pt-4">
        {isLoadingExplanation ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-4/6" />
          </div>
        ) : (
          <p className="text-gray-300 text-base leading-relaxed">{explanation}</p>
        )}
      </div>

      <button
        onClick={onNext}
        className="bg-green-700 hover:bg-green-600 text-white text-base font-semibold py-4 rounded-lg transition-colors"
      >
        Next Scenario →
      </button>
    </div>
  )
}
