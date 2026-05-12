import { useNavigate, useRouterState } from '@tanstack/react-router'

export function BottomNav() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const isStats = location.pathname === '/stats'
  const isHome = !isStats && !location.pathname.startsWith('/scenario')

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-50">
      <button
        onClick={() => navigate({ to: '/' })}
        className={`flex-1 flex flex-col items-center justify-center py-4 gap-1 transition-colors ${
          isHome ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <span className="text-xs font-medium">Scenarios</span>
      </button>

      <button
        onClick={() => navigate({ to: '/stats' })}
        className={`flex-1 flex flex-col items-center justify-center py-4 gap-1 transition-colors ${
          isStats ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs font-medium">Stats</span>
      </button>
    </nav>
  )
}
