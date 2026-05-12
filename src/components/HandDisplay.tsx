import type { Card } from '@/types/poker'
import { CardDisplay } from './CardDisplay'

interface Props {
  hand: Card[]
}

export function HandDisplay({ hand }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {hand.map((card, i) => (
        <CardDisplay key={i} card={card} size="lg" />
      ))}
    </div>
  )
}
