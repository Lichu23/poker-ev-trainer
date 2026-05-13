# Poker EV Trainer

A mobile-first training app to sharpen your poker decision-making at the river. Pick a spot, choose an action, and instantly see whether you made the highest-EV play — and by how much.

**Live app:** [poker-ev-trainer.vercel.app](https://poker-ev-trainer.vercel.app)

---

## What is EV?

**Expected Value (EV)** is how much money a decision makes on average over time. A +EV play makes you money in the long run. A -EV play costs you money, even if you win the hand sometimes.

Good poker is about consistently choosing the highest-EV action — not about short-term results.

---

## How it works

1. **Sign in or play as guest** — Google sign-in unlocks persistent stats, leaderboard, and rank progression
2. **Choose your filters** — pick a difficulty and hand type (or leave both as "All")
3. **Hit Deal Hand** — the app picks a random river spot from 391 scenarios
4. **Read the situation** — board, your hand, pot size, villain type, and villain action
5. **Choose your action** — Fold, Check, Call, or one of the bet sizes
6. **See your result** — EV of every action, the optimal play highlighted, XP earned, and an AI explanation
7. **Hit Next Scenario** — get another random spot with the same filters, no menu required

---

## Features

### Core
- **391 river scenarios** — generated across all villain types, hand categories, and board textures
- **Real EV math** — every action calculated using pot odds, fold equity, and Monte Carlo equity vs the villain's range
- **AI explanation** — after each decision, an AI coach explains the correct play using the exact EV numbers
- **Pot odds hint** — when villain bets, see exactly how much equity you need to call profitably
- **Bluff break-even hint** — see how often villain needs to fold for your bluff to break even

### Progression (requires sign-in)
- **XP system** — earn XP after every hand; harder scenarios give more (Beginner 1×, Intermediate 2×, Advanced 3×)
- **Levels 1–100** — XP thresholds scale with each level; completing level 100 grants a prestige star (★) and resets to 1
- **Streak bonus** — consecutive correct answers multiply your XP up to +25 per hand
- **Rank tiers** — 4 suits × 3 levels = 12 divisions based on your avg EV lost per hand:

| Rank | Avg EV lost | Level |
|------|-------------|-------|
| ♠ Spade I–III | < 2.5 | Elite |
| ♥ Heart I–III | 2.5 – 8 | Advanced |
| ♦ Diamond I–III | 8 – 18 | Intermediate |
| ♣ Club I–III | > 18 | Beginner |

### Stats & Leaderboard
- **Persistent stats** — all-time correct % and EV lost synced to your account
- **Breakdown by category** — see exactly which hand types you leak most EV on
- **Leaderboard** — compete globally, ranked by avg EV lost (min 20 hands to appear)

---

## Villain types

| Villain | Style |
|---------|-------|
| **Nit** | Folds very often, only bets strong hands |
| **TAG** | Balanced, folds a reasonable amount |
| **LAG** | Aggressive, calls and bluffs more |
| **Fish** | Calls too wide, rarely folds |

---

## Hand categories

| Category | What it means |
|----------|--------------|
| **Nuts** | You have the best possible hand |
| **Strong value** | A very strong hand (set, straight, flush) |
| **Marginal** | A medium hand — the right play is less obvious |
| **Bluff catcher** | A hand that beats bluffs but loses to value |
| **Air** | You missed — pure bluff territory |

---

## Tips

- **Filter by one category** to drill a specific leak (e.g. only bluff catchers if you call too often)
- **Try the wrong action** on purpose to see exactly how much EV you lose
- **Focus on the EV bar** — even when correct, check how close the options are
- **Play advanced scenarios** — they give 3× XP and count double toward your rank

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth) |
| Hand evaluation | pokersolver + Monte Carlo equity |
| AI explanations | Groq API |
| Hosting | Vercel |

---

## Local setup

```bash
git clone https://github.com/Lichu23/poker-ev-trainer.git
cd poker-ev-trainer
npm install
```

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_key        # optional — enables AI explanations
```

```bash
npm run dev
```

The app runs without a Groq key — it falls back to static explanations per scenario.
