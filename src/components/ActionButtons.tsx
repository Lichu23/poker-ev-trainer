import type { PlayerAction } from '@/types/poker'
import { raiseAmountFromBet } from '@/lib/evCalculator'

interface Props {
  actions: PlayerAction[]
  pot: number
  villainBetAmount?: number
  onAction: (action: PlayerAction) => void
}

function getLabel(
  action: PlayerAction,
  pot: number,
  villainBetAmount?: number,
): { label: string; sub?: string } {
  switch (action) {
    case 'fold':          return { label: 'Fold' }
    case 'check':         return { label: 'Check' }
    case 'call':          return { label: `Call $${villainBetAmount ?? 0}` }
    case 'bet_third':     return { label: `Bet $${Math.round(pot * 0.33)}`, sub: '1/3 pot' }
    case 'bet_half':      return { label: `Bet $${Math.round(pot * 0.5)}`, sub: '1/2 pot' }
    case 'bet_two_thirds':return { label: `Bet $${Math.round(pot * 0.67)}`, sub: '2/3 pot' }
    case 'bet_pot':       return { label: `Bet $${pot}`, sub: 'pot' }
    case 'raise': {
      const raiseAmt = raiseAmountFromBet(villainBetAmount ?? 0)
      return { label: `Raise to $${raiseAmt}`, sub: '2.5× bet' }
    }
  }
}

const ACTION_STYLES: Record<PlayerAction, string> = {
  fold:           'bg-surface-3 hover:bg-gray-600',
  check:          'bg-blue-700 hover:bg-blue-600',
  call:           'bg-blue-700 hover:bg-blue-600',
  bet_third:      'bg-brand-700 hover:bg-brand-600',
  bet_half:       'bg-brand-700 hover:bg-brand-600',
  bet_two_thirds: 'bg-brand-700 hover:bg-brand-600',
  bet_pot:        'bg-yellow-600 hover:bg-yellow-500',
  raise:          'bg-red-700 hover:bg-red-600',
}

export function ActionButtons({ actions, pot, villainBetAmount, onAction }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {actions.map((action) => {
        const { label, sub } = getLabel(action, pot, villainBetAmount)
        return (
          <button
            key={action}
            onClick={() => onAction(action)}
            className={`${ACTION_STYLES[action]} text-white text-base px-5 py-4 rounded-lg font-semibold min-w-[120px] transition-colors`}
          >
            <div>{label}</div>
            {sub && <div className="text-xs opacity-75">{sub}</div>}
          </button>
        )
      })}
    </div>
  )
}
