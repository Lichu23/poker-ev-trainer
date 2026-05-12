import type { Card } from '@/types/poker'
import { CardDisplay } from './CardDisplay'

interface Props {
  board: Card[]
}

export function BoardDisplay({ board }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {board.map((card, i) => (
        <CardDisplay key={i} card={card} size="md" />
      ))}
    </div>
  )
}
