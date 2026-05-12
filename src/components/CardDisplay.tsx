import type { Card } from '@/types/poker'

const SUIT_SYMBOLS: Record<string, string> = {
  h: '♥',
  d: '♦',
  c: '♣',
  s: '♠',
}

const SUIT_COLORS: Record<string, string> = {
  h: 'text-red-600',
  d: 'text-red-600',
  c: 'text-gray-900',
  s: 'text-gray-900',
}

const SIZE_CLASSES = {
  sm: 'w-8 h-11 text-xs',
  md: 'w-12 h-16 text-sm',
  lg: 'w-14 h-20 text-base',
}

interface Props {
  card: Card
  size?: 'sm' | 'md' | 'lg'
}

function parseCard(card: Card) {
  const suit = card.slice(-1)
  const rank = card.slice(0, -1)
  return { rank: rank === 'T' ? '10' : rank, suit }
}

export function CardDisplay({ card, size = 'md' }: Props) {
  const { rank, suit } = parseCard(card)
  const colorClass = SUIT_COLORS[suit]

  return (
    <div
      className={`${SIZE_CLASSES[size]} bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center shadow-md font-bold select-none`}
    >
      <span className={colorClass}>{rank}</span>
      <span className={colorClass}>{SUIT_SYMBOLS[suit]}</span>
    </div>
  )
}
