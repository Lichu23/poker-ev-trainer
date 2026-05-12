# Poker EV Trainer — Technical Plan

## Overview
A poker decision training app where players face river situations and choose an action.
The app calculates EV for each option and tells the player if their choice was correct.

## Development Guidelines

- **Reusable components**: If the same UI element is used in more than one place, extract it into a shared component in `src/components/`. No duplicated JSX.
- **Styling**: Tailwind CSS utility classes only — no component library.

---

## MVP Scope
- Heads-up only (you vs 1 villain)
- River street only
- Predefined curated scenarios (20–30 spots)
- EV calculated client-side with simple formulas
- Static explanations per scenario
- Session stats tracked in localStorage

---

## Tech Stack

| Layer         | Technology          | Why                                       |
|---------------|---------------------|-------------------------------------------|
| Bundler       | Vite                | Fast dev server, simple setup             |
| Framework     | React 18 + TypeScript | Familiar, component-based               |
| Routing       | TanStack Router     | File-based, type-safe, upgrades to Start  |
| Data fetching | TanStack Query      | For future Groq API calls                 |
| Styling       | Tailwind CSS        | Fast, utility-first                       |
| Hand Eval     | pokersolver (npm)   | Evaluates poker hand strength in JS       |
| Scenarios     | Local JSON/TS files | No backend needed for MVP                 |
| Persistence   | localStorage        | Save session stats without a DB           |
| AI (optional) | Groq API            | Generate dynamic explanations             |

---

## Folder Structure

```
poker-ev-trainer/
├── public/
├── src/
│   ├── routes/                    ← TanStack Router pages
│   │   ├── index.tsx              ← Home / scenario picker
│   │   ├── scenario.$id.tsx       ← Play a scenario
│   │   └── stats.tsx              ← Session stats
│   ├── components/
│   │   ├── CardDisplay.tsx        ← Renders a single playing card visually
│   │   ├── BoardDisplay.tsx       ← Shows 5 community cards
│   │   ├── HandDisplay.tsx        ← Shows player's 2 hole cards
│   │   ├── ActionButtons.tsx      ← Fold / Check / Call / Bet options
│   │   ├── ResultPanel.tsx        ← EV breakdown after decision
│   │   ├── EVBar.tsx              ← Visual EV comparison bar chart
│   │   ├── ScenarioCard.tsx       ← Scenario preview on home screen
│   │   ├── BottomNav.tsx          ← Fixed bottom tab bar (Scenarios / Stats)
│   │   ├── Home.tsx               ← Home page: filter dropdowns + scenario list
│   │   ├── ScenarioView.tsx       ← Full scenario play UI (board, hand, actions, result)
│   │   ├── ScenarioPage.tsx       ← Route wrapper: resolves id param → ScenarioView
│   │   ├── StatsPage.tsx          ← Session stats page component
│   │   └── CategoryRow.tsx        ← Single category row in stats breakdown
│   ├── data/
│   │   ├── scenarios.ts           ← 20-30 predefined river scenarios
│   │   └── villainProfiles.ts     ← Fold frequencies per villain type
│   ├── lib/
│   │   ├── evCalculator.ts        ← Core EV math functions
│   │   ├── handEvaluator.ts       ← Wrapper around pokersolver
│   │   └── sessionStorage.ts      ← localStorage read/write helpers
│   ├── types/
│   │   └── poker.ts               ← All TypeScript types
│   ├── hooks/
│   │   └── useScenario.ts         ← Scenario state + action handling
│   └── App.tsx
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Core TypeScript Types

```typescript
// src/types/poker.ts

type Suit = 'h' | 'd' | 'c' | 's'
type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'T'|'J'|'Q'|'K'|'A'
type Card = `${Rank}${Suit}`  // e.g. "As", "Kh", "Tc"

type Street = 'river'
type Position = 'BTN' | 'SB' | 'BB' | 'CO' | 'MP' | 'UTG'
type VillainType = 'nit' | 'tag' | 'lag' | 'fish'
type VillainAction = 'check' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'overbet'
type PlayerAction = 'fold' | 'check' | 'call' | 'bet_third' | 'bet_half' | 'bet_two_thirds' | 'bet_pot' | 'raise'
type HandCategory = 'nuts' | 'strong_value' | 'marginal' | 'bluff_catcher' | 'air'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface Scenario {
  id: number
  title: string
  difficulty: Difficulty
  street: Street
  board: Card[]             // 5 cards
  hand: Card[]              // 2 hole cards
  position: Position
  pot: number
  playerStack: number
  villainStack: number
  villainType: VillainType
  villainAction: VillainAction
  villainBetAmount?: number
  handCategory: HandCategory
  availableActions: PlayerAction[]
  explanation: string
}

interface ActionEV {
  action: PlayerAction
  betAmount?: number
  ev: number
  isOptimal: boolean
}

interface ScenarioResult {
  scenarioId: number
  playerAction: PlayerAction
  playerBetAmount?: number
  evChosen: number
  evOptimal: number
  evLost: number
  isCorrect: boolean
  allEVs: ActionEV[]
  timestamp: number
}
```

---

## EV Calculator Logic

```typescript
// src/lib/evCalculator.ts

// EV of calling a villain bet
// equity = % of time you win at showdown
function evCall(equity: number, pot: number, callAmount: number): number {
  const totalPot = pot + callAmount * 2
  return equity * totalPot - (1 - equity) * callAmount
}

// Minimum equity needed to profitably call (pot odds)
function requiredEquity(callAmount: number, pot: number): number {
  return callAmount / (pot + callAmount * 2)
}

// EV of betting (combines fold equity + showdown equity)
function evBet(
  equity: number,
  pot: number,
  betAmount: number,
  foldEquity: number   // % villain folds to this bet
): number {
  const showdownEV = equity * (pot + betAmount * 2) - (1 - equity) * betAmount
  return foldEquity * pot + (1 - foldEquity) * showdownEV
}

// Alpha: minimum fold % needed for a bluff to break even
function alpha(betAmount: number, pot: number): number {
  return betAmount / (pot + betAmount)
}

// EV of folding is always 0
function evFold(): number {
  return 0
}
```

---

## Villain Fold Frequency Table

```typescript
// src/data/villainProfiles.ts

const FOLD_FREQUENCIES = {
  nit:  { third: 0.60, half: 0.68, two_thirds: 0.74, pot: 0.80, overbet: 0.85 },
  tag:  { third: 0.40, half: 0.48, two_thirds: 0.54, pot: 0.58, overbet: 0.50 },
  lag:  { third: 0.30, half: 0.37, two_thirds: 0.43, pot: 0.47, overbet: 0.44 },
  fish: { third: 0.14, half: 0.16, two_thirds: 0.20, pot: 0.23, overbet: 0.26 },
}
```

---

## Scenario Example

```typescript
{
  id: 1,
  title: "Value Betting Top Pair vs Passive TAG",
  difficulty: "beginner",
  street: "river",
  board: ["As", "Kd", "7c", "2h", "9s"],
  hand: ["Ks", "Qs"],
  position: "BTN",
  pot: 100,
  playerStack: 200,
  villainStack: 200,
  villainType: "tag",
  villainAction: "check",
  villainBetAmount: undefined,
  handCategory: "strong_value",
  availableActions: ["check", "bet_third", "bet_half", "bet_two_thirds"],
  explanation: "Villain checks the river on a dry board. You have top pair top kicker (TPTK). A TAG's check caps their range at marginal hands — they'd bet stronger hands for value. Betting 60–70% pot extracts value from weaker Ax and Kx hands. Checking back is a mistake: you give up all value against hands that would have called."
}
```

---

## Screen Flow

```
Bottom Tab Bar (fixed, always visible)
  ├── Scenarios tab → Home Screen
  └── Stats tab     → Stats Screen

Home Screen
  ├── Two filter dropdowns (Difficulty / Category) with label + chevron
  ├── Scenario count
  └── Scenario list (ScenarioCard per item)
        └── tap → Scenario Screen

Scenario Screen
  ├── ← All scenarios (back link)
  ├── Title + difficulty · category · position
  ├── Board (green felt panel)
  ├── Your hand (green felt panel)
  ├── Pot / Stack / Villain info
  ├── Villain action + pot odds hint (if villain bet) or alpha hints (if villain checked)
  ├── [decision phase] Action buttons → fade out on pick
  └── [result phase]  Result Panel (fade in)
        ├── ✓ Correct / ✗ Not optimal
        ├── Your EV · Optimal EV · EV Lost
        ├── EV bar chart (all actions)
        ├── Explanation text
        └── Next Scenario → (returns to Home)

Stats Screen
  ├── Total played · Correct % · EV Lost
  ├── Breakdown by hand category (progress bars, color-coded)
  └── Reset session button
```

---

## MVP Scenarios (20 spots)

| # | Board | Hand | Villain Type | Villain Action | Category | Correct Play |
|---|-------|------|--------------|----------------|----------|--------------|
| 1 | A K 7 2 9 rainbow | KQ | TAG | Check | Strong value | Bet 2/3 pot |
| 2 | A K 7 2 9 rainbow | 56 (missed straight) | TAG | Check | Air | Bet bluff or check |
| 3 | 9 8 7 2 J rainbow | JT | Fish | Check | Nuts | Bet large (pot) |
| 4 | 9 8 7 2 J rainbow | AK | TAG | Bet 2/3 | Air | Fold |
| 5 | K K 5 3 7 rainbow | KQ (trips) | Nit | Bet small | Nuts | Raise |
| 6 | Qh Jh 8h 4h 2s | Ah Th (nut flush) | TAG | Check | Nuts | Bet large |
| 7 | Qh Jh 8h 4h 2s | KK (no heart) | TAG | Bet pot | Bluff catcher | Fold |
| 8 | A 7 2 4 9 rainbow | AA (top set) | Fish | Check | Nuts | Bet big |
| 9 | A 7 2 4 9 rainbow | QQ (overpair) | TAG | Overbet | Bluff catcher | Call |
| 10 | J T 9 2 5 rainbow | 87 (straight) | LAG | Bet 2/3 | Nuts | Raise |
| 11 | A 7 2 4 9 rainbow | A4 (weak top pair) | Fish | Check | Marginal | Bet small |
| 12 | K Q 5 2 8 rainbow | KJ (top pair) | Nit | Bet pot | Bluff catcher | Fold |
| 13 | 9 8 7 2 J rainbow | 99 (set) | TAG | Check | Strong value | Bet 2/3 |
| 14 | A K 7 2 9 rainbow | AK (top two pair) | LAG | Bet 2/3 | Nuts | Raise |
| 15 | Th 9h 8h 2s 5c | Kh Qh (king-high flush) | Fish | Check | Strong value | Bet large |
| 16 | K K 5 3 7 rainbow | QQ (bluff catcher) | LAG | Overbet | Bluff catcher | Fold |
| 17 | J T 9 2 5 rainbow | AK (overcards) | Nit | Check | Air | Bluff or check |
| 18 | A 7 2 4 9 rainbow | 77 (set → full house) | TAG | Check | Nuts | Bet large |
| 19 | Qh Jh 8h 4h 2s | 6h 5h (low flush) | TAG | Bet 1/3 | Marginal | Call |
| 20 | A K 7 2 9 rainbow | 97 (second pair) | Fish | Bet 1/3 | Bluff catcher | Call |

---

## Bet Sizing Reference

| Label in UI | % of Pot | Example ($100 pot) |
|-------------|----------|--------------------|
| Bet small   | 33%      | $33                |
| Bet half    | 50%      | $50                |
| Bet 2/3     | 66%      | $66                |
| Bet pot     | 100%     | $100               |
| Overbet     | 150%     | $150               |

---

## Pot Odds Quick Reference (baked into UI feedback)

| Villain Bet Size | Required Equity to Call |
|-----------------|------------------------|
| 1/3 pot         | 20%                    |
| 1/2 pot         | 25%                    |
| 2/3 pot         | 28.6%                  |
| Pot             | 33.3%                  |
| 1.5x overbet    | 37.5%                  |
