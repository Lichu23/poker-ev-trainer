import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useScenario } from '@/hooks/useScenario'
import { useGroqExplanation } from '@/hooks/useGroqExplanation'
import { BoardDisplay } from './BoardDisplay'
import { HandDisplay } from './HandDisplay'
import { ActionButtons } from './ActionButtons'
import { ResultPanel } from './ResultPanel'
import { requiredEquity, alpha, betAmountFromAction } from '@/lib/evCalculator'
import type { Scenario, PlayerAction } from '@/types/poker'

const BET_ACTIONS: PlayerAction[] = ['bet_third', 'bet_half', 'bet_two_thirds', 'bet_pot', 'raise']

interface Props {
  scenario: Scenario
  onNext: () => void
}

export function ScenarioView({ scenario, onNext }: Props) {
  const navigate = useNavigate()
  const { phase, result, chooseAction, xpBreakdown, levelInfo, streak } = useScenario(scenario)
  const [showHint, setShowHint] = useState(false)
  const { data: groqExplanation, isLoading: isLoadingExplanation } = useGroqExplanation(scenario, result)

  useEffect(() => {
    if (phase === 'result') {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight + 180, behavior: 'smooth' })
      }, 300)
    }
  }, [phase])

  const reqEq = scenario.villainBetAmount
    ? requiredEquity(scenario.villainBetAmount, scenario.pot)
    : null

  const villainActionLabel = scenario.villainBetAmount
    ? `Bet $${scenario.villainBetAmount}`
    : scenario.villainAction === 'check'
    ? 'Check'
    : scenario.villainAction.replace('_', ' ')

  // Show alpha hints for each available bet sizing when villain checked
  const alphaHints = !scenario.villainBetAmount
    ? scenario.availableActions
        .filter((a): a is PlayerAction => BET_ACTIONS.includes(a))
        .map((a) => {
          const betAmt = betAmountFromAction(a, scenario.pot)
          const breakEven = alpha(betAmt, scenario.pot)
          return { action: a, breakEven }
        })
    : []

  return (
    <div className="min-h-screen bg-surface-0 text-white px-4 py-8 max-w-xl mx-auto flex flex-col gap-6">
      <button
        onClick={() => navigate({ to: '/lobby' })}
        className="text-gray-500 hover:text-gray-300 text-sm self-start transition-colors"
      >
        ← Change filters
      </button>

      <div>
        <h2 className="text-xl font-bold text-white mb-1">{scenario.title}</h2>
        <div className="flex gap-2 text-xs text-gray-500">
          <span>{scenario.difficulty}</span>
          <span>·</span>
          <span>{scenario.handCategory.replace('_', ' ')}</span>
          <span>·</span>
          <span>{scenario.position}</span>
        </div>
      </div>

      {/* Board + hand on green felt */}
      <div className="bg-surface-1 border border-surface-3 rounded-xl p-4 flex flex-col gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-medium">Board</div>
          <BoardDisplay board={scenario.board} />
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-medium">Your hand</div>
          <HandDisplay hand={scenario.hand} />
        </div>
      </div>

      <div className="bg-surface-1 rounded-xl p-4 grid grid-cols-3 gap-2 text-center text-base">
        <div>
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Pot</div>
          <div className="text-white font-semibold">${scenario.pot}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Your stack</div>
          <div className="text-white font-semibold">${scenario.playerStack}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Villain</div>
          <div className="text-white font-semibold capitalize">{scenario.villainType}</div>
        </div>
      </div>

      <div className="bg-surface-1 rounded-xl p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Villain action</div>
        <div className="text-white font-medium">{villainActionLabel}</div>
        {reqEq !== null && (
          <div className="text-yellow-400 text-xs mt-1">
            You need {(reqEq * 100).toFixed(1)}% equity to call profitably
          </div>
        )}
        {alphaHints.length > 0 && phase === 'decision' && (
          <div className="mt-2">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            {showHint && (
              <div className="mt-1.5 flex flex-col gap-0.5">
                {alphaHints.map(({ action, breakEven }) => (
                  <div key={action} className="text-blue-400 text-xs">
                    {action.replaceAll('_', ' ')}: villain must fold &gt;{(breakEven * 100).toFixed(0)}% to break even
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decision phase */}
      <div
        className={`transition-all duration-300 ${
          phase === 'decision' ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        <div className="text-base text-gray-400 mb-3 text-center">What do you do?</div>
        <ActionButtons
          actions={scenario.availableActions}
          pot={scenario.pot}
          villainBetAmount={scenario.villainBetAmount}
          onAction={(action: PlayerAction) => chooseAction(action)}
        />
      </div>

      {/* Result phase */}
      <div
        className={`transition-all duration-300 ${
          phase === 'result' ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        {result && (
          <ResultPanel
            result={result}
            explanation={groqExplanation ?? scenario.explanation}
            isLoadingExplanation={isLoadingExplanation}
            onNext={onNext}
            xpBreakdown={xpBreakdown ?? undefined}
            levelInfo={levelInfo ?? undefined}
            streak={streak}
          />
        )}
      </div>
    </div>
  )
}
