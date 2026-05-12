# Poker EV Trainer — Phase Tracker

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## Phase 1 — Project Setup
- [X] Create Vite + React + TypeScript project (`npm create vite@latest`)
- [X] Install TanStack Router (`@tanstack/react-router`)
- [X] Install TanStack Query (`@tanstack/react-query`)
- [X] Install Tailwind CSS and configure
- [X] Install pokersolver (`pokersolver`)
- [X] Set up TanStack Router file-based routing
- [X] Create base folder structure: `components/`, `lib/`, `data/`, `types/`, `hooks/`, `routes/`
- [X] Create `src/types/poker.ts` with all TypeScript types

## Phase 2 — Core EV Calculator
- [X] Implement `evFold()` → always returns 0
- [X] Implement `evCall(equity, pot, callAmount)` → EV of calling a bet
- [X] Implement `requiredEquity(callAmount, pot)` → pot odds formula
- [X] Implement `evBet(equity, pot, betAmount, foldEquity)` → EV of betting
- [X] Implement `alpha(betAmount, pot)` → break-even bluff fold frequency
- [X] Implement `handEvaluator.ts` wrapper around pokersolver
- [ ] Write tests for all EV formulas with known inputs/outputs — deferred, post-MVP

## Phase 3 — Scenario Data
- [X] Create `src/data/villainProfiles.ts` with fold frequency tables (nit/tag/lag/fish)
- [X] Build all 20 river scenarios in `src/data/scenarios.ts`
- [X] Tag each scenario with difficulty (beginner / intermediate / advanced)
- [X] Validate: run EV formulas on each scenario to confirm correct action — manually verified, correct action is consistent with EV math
- [X] Add hand category to each scenario (nuts / strong_value / marginal / bluff_catcher / air)

## Phase 4 — UI Components
- [X] `CardDisplay.tsx` — renders a single card (rank + suit, color by suit)
- [X] `BoardDisplay.tsx` — renders 5 community cards in a row
- [X] `HandDisplay.tsx` — renders 2 hole cards
- [X] `ActionButtons.tsx` — fold/check/call/bet buttons with $ amounts shown
- [X] `ResultPanel.tsx` — shows EV of chosen action + optimal action + explanation
- [X] `EVBar.tsx` — horizontal bar chart comparing EV of all available actions
- [X] `ScenarioCard.tsx` — compact scenario preview for the home screen list

## Phase 5 — Pages / Routes
- [X] `routes/index.tsx` — home page: scenario list with difficulty filter
- [X] `routes/scenario.$id.tsx` — scenario play page: board + hand + actions
- [X] Result view inside scenario page (shown after player picks action)
- [X] `routes/stats.tsx` — session stats page

## Phase 6 — State & Storage
- [X] `hooks/useScenario.ts` — manages scenario state (idle → decision → result)
- [X] `lib/sessionStorage.ts` — save/load ScenarioResult[] to localStorage
- [X] Wire stats page to read from localStorage
- [X] Handle "reset session" button on stats page

## Phase 7 — Polish & Testing
- [X] Dark poker theme: green felt background on board/hand area, dark panels
- [X] Responsive layout (max-w-xl / max-w-2xl, mobile-first padding)
- [X] Smooth transitions between decision state and result state (opacity fade)
- [X] Pot odds shown inline when villain bets (e.g. "You need 28% equity to call")
- [X] Alpha shown inline when you consider bluffing (e.g. "Villain must fold >40% to break even")
- [X] Bottom tab bar navigation (`BottomNav.tsx`) — Stats always one tap away, no scrolling required
- [X] Filter dropdowns with labels + chevron icons — replaces pill buttons, mobile-native UX
- [X] Manual QA: played calling, raise, and bluff scenarios — EV values verified correct
- [X] Known limitation noted: raise sizing uses 1.5× pot (see Notes)

## Phase 8 — Optional Groq Integration
- [X] Set up Groq API key in `.env.local`
- [X] Create TanStack Query hook for Groq explanation request (`hooks/useGroqExplanation.ts`)
- [X] Replace static explanation text with Groq-generated explanation
- [X] Add loading state while Groq responds (animated skeleton)
- [X] Fallback to static explanation if Groq fails or key is missing

---

## Future Versions

### V2 — Dynamic Scenarios + Backend
- [ ] Node.js / Express API for dynamic scenario generation
- [ ] Monte Carlo equity simulation server-side (1000+ iterations)
- [ ] PostgreSQL database for user progress and hand history
- [ ] TanStack Query wired to real API endpoints
- [ ] Dynamic scenario difficulty scaling based on user performance

### V3 — Full Stack + User Accounts
- [ ] Migrate from Vite to TanStack Start (same router, smooth upgrade)
- [ ] User authentication (Clerk or Supabase Auth)
- [ ] Leaderboards and EV tracking across sessions
- [ ] Multi-way pot support (3-player scenarios)
- [ ] GTO solver integration for more precise EV calculations
- [ ] Pre-flop scenarios (not just river)

---

## Notes

- EV formulas are approximations — fold frequencies per villain type are estimates, not exact GTO values
- pokersolver evaluates hand strength but does not calculate equity vs a range — equity values in scenarios are manually estimated for MVP
- In V2, Monte Carlo simulation will replace manually estimated equity values
- Raise sizing uses 1.5× pot regardless of villain's bet size — in facing-a-bet spots this is too large and can make "call" show higher EV than "raise" even when raising is conventionally correct. Fix in V2 by basing raise size on villain's bet (e.g. 2.5–3× the bet amount)
