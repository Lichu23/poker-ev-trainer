import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle } from '@/lib/auth'

const HERO_BOARD = ['As', 'Kd', '7c', '2h', '9s'] as const
const HERO_HAND = ['Ks', 'Qs'] as const

function MiniCard({ card }: { card: string }) {
  const rank = card.slice(0, -1)
  const suit = card.slice(-1)
  const isRed = suit === 'h' || suit === 'd'
  const suitSymbol = suit === 'h' ? '♥' : suit === 'd' ? '♦' : suit === 'c' ? '♣' : '♠'
  return (
    <div className="bg-white rounded-lg w-10 h-14 flex flex-col items-center justify-center shadow-lg select-none">
      <span className={`font-bold text-sm leading-none ${isRed ? 'text-red-500' : 'text-gray-900'}`}>{rank}</span>
      <span className={`text-xs leading-none mt-0.5 ${isRed ? 'text-red-500' : 'text-gray-900'}`}>{suitSymbol}</span>
    </div>
  )
}

export function OnboardingScreen() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/lobby' })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-full bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-950 text-white flex flex-col items-center justify-center px-6 max-w-md mx-auto">
      {/* Hero: board + hand */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="flex gap-2">
          {HERO_BOARD.map((card) => <MiniCard key={card} card={card} />)}
        </div>
        <div className="flex gap-2">
          {HERO_HAND.map((card) => <MiniCard key={card} card={card} />)}
        </div>
        <p className="text-gray-500 text-sm mt-1">Villain checks. What's your move?</p>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-400 mb-2 text-center">Poker EV Trainer</h1>
      <p className="text-gray-400 text-center text-sm mb-10">
        Train your river decisions.<br />Make the highest-EV play every time.
      </p>

      {/* CTAs */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => navigate({ to: '/lobby' })}
          className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-bold text-base rounded-xl py-4 transition-colors"
        >
          Play as Guest
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs">sign in to track stats &amp; compete</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold text-base rounded-xl py-4 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  )
}
