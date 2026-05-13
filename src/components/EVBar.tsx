import type { ActionEV, PlayerAction } from '@/types/poker'

const ACTION_LABELS: Record<PlayerAction, string> = {
  fold:           'Fold',
  check:          'Check',
  call:           'Call',
  bet_third:      'Bet 1/3',
  bet_half:       'Bet 1/2',
  bet_two_thirds: 'Bet 2/3',
  bet_pot:        'Bet Pot',
  raise:          'Raise',
}

interface Props {
  evs: ActionEV[]
}

export function EVBar({ evs }: Props) {
  const maxAbsEV = Math.max(...evs.map((e) => Math.abs(e.ev)), 1)

  return (
    <div className="flex flex-col gap-2 w-full">
      {evs.map(({ action, ev, isOptimal }) => {
        const widthPct = `${(Math.abs(ev) / maxAbsEV) * 100}%`
        const barColor = isOptimal ? 'bg-green-500' : ev < 0 ? 'bg-red-500/50' : 'bg-white/25'
        const evColor = ev >= 0 ? 'text-green-400' : 'text-red-400'

        return (
          <div key={action} className="flex items-center gap-3">
            <span className={`text-sm w-20 text-right shrink-0 ${isOptimal ? 'text-white font-medium' : 'text-zinc-500'}`}>
              {ACTION_LABELS[action]}
            </span>
            <div className="flex-1 bg-surface-2 rounded-full h-4 overflow-hidden">
              <div
                className={`${barColor} h-full rounded-full transition-all duration-300`}
                style={{ width: widthPct }}
              />
            </div>
            <span className={`text-sm font-mono w-16 shrink-0 ${isOptimal ? evColor : 'text-zinc-500'}`}>
              {ev >= 0 ? '+' : ''}{ev.toFixed(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
