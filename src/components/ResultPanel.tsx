import type { ScenarioResult } from '@/types/poker'
import type { XPBreakdown, LevelInfo } from '@/lib/xpCalculator'
import { EVBar } from './EVBar'

interface Props {
  result: ScenarioResult
  explanation: string
  isLoadingExplanation?: boolean
  onNext: () => void
  xpBreakdown?: XPBreakdown
  levelInfo?: LevelInfo
  streak?: number
}

export function ResultPanel({ result, explanation, isLoadingExplanation = false, onNext, xpBreakdown, levelInfo, streak = 0 }: Props) {
  const { isCorrect, evChosen, evOptimal, evLost, allEVs } = result

  return (
    <div className="bg-surface-2 rounded-xl p-6 flex flex-col gap-5 w-full">
      <div
        className={`text-xl font-bold text-center ${isCorrect ? 'text-brand-400' : 'text-red-400'}`}
      >
        {isCorrect ? '✓ Correct!' : '✗ Not optimal'}
        {streak >= 2 && (
          <span className="ml-2 text-sm font-normal text-yellow-400">{streak} in a row 🔥</span>
        )}
      </div>

      <div className="flex justify-around text-center">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Your EV</div>
          <div
            className={`text-2xl font-bold ${evChosen >= 0 ? 'text-brand-400' : 'text-red-400'}`}
          >
            {evChosen >= 0 ? '+' : ''}{evChosen.toFixed(1)}
          </div>
        </div>
        {!isCorrect && (
          <>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Optimal EV</div>
              <div className="text-2xl font-bold text-brand-400">
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

      <div className="border-t border-surface-3 pt-4">
        {isLoadingExplanation ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-surface-3 rounded w-full" />
            <div className="h-4 bg-surface-3 rounded w-5/6" />
            <div className="h-4 bg-surface-3 rounded w-4/6" />
          </div>
        ) : (
          <p className="text-gray-300 text-base leading-relaxed">{explanation}</p>
        )}
      </div>

      {xpBreakdown && levelInfo && (
        <div className="border-t border-surface-3 pt-4 flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Base XP</span>
              <span className="text-brand-400">+{xpBreakdown.base}</span>
            </div>
            {xpBreakdown.correct > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Correct</span>
                <span className="text-brand-400">+{xpBreakdown.correct}</span>
              </div>
            )}
            {xpBreakdown.precision > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Precision (EV lost &lt;$2)</span>
                <span className="text-brand-400">+{xpBreakdown.precision}</span>
              </div>
            )}
            {xpBreakdown.streak > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Streak bonus</span>
                <span className="text-yellow-400">+{xpBreakdown.streak}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-white border-t border-surface-3 pt-1 mt-1">
              <span>Total XP</span>
              <span className="text-brand-400">+{xpBreakdown.total} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 shrink-0">
              {levelInfo.prestige > 0 && <span className="text-yellow-400 mr-1">★</span>}
              Lv.{levelInfo.level}
            </span>
            <div className="flex-1 bg-surface-3 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 shrink-0">
              {levelInfo.currentXP}/{levelInfo.xpForNext}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="bg-brand-700 hover:bg-brand-600 text-white text-base font-semibold py-4 rounded-lg transition-colors"
      >
        Next Scenario →
      </button>
    </div>
  )
}
