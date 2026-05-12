# Poker EV Trainer

A mobile-first training app to sharpen your poker decision-making at the river. Pick a spot, choose an action, and instantly see whether you made the highest-EV play — and by how much.

---

## What is EV?

**Expected Value (EV)** is how much money a decision makes on average over time. A +EV play makes you money in the long run. A -EV play costs you money, even if you win the hand sometimes.

Good poker is about consistently choosing the highest-EV action — not about short-term results.

---

## How it works

1. **Choose your filters** — pick a difficulty and hand type (or leave both as "All")
2. **Hit Deal Hand** — the app picks a random river spot from 390+ scenarios
3. **Read the situation** — board, your hand, pot size, villain type, and villain action
4. **Choose your action** — Fold, Check, Call, or one of the bet sizes
5. **See your result** — EV of every action, the optimal play highlighted, and an AI explanation
6. **Hit Next Hand** — get another random spot with the same filters, no menu required

Each scenario features a different villain type with realistic tendencies:

| Villain | Style |
|---------|-------|
| **Nit** | Folds very often, only bets strong hands |
| **TAG** | Balanced, folds a reasonable amount |
| **LAG** | Aggressive, calls and bluffs more |
| **Fish** | Calls too wide, rarely folds |

---

## Features

- **390+ river scenarios** — generated across all villain types, hand categories, and board textures
- **Real EV math** — every action is calculated using pot odds, fold equity, and Monte Carlo equity vs the villain's range
- **Game mode** — Deal Hand picks a random spot instantly; Next Hand chains spots without leaving the screen
- **Filter by difficulty and hand type** — drill the exact spots where you leak the most EV
- **Pot odds hint** — when the villain bets, see exactly how much equity you need to call profitably
- **Bluff hint** — reveal how often the villain needs to fold for your bluff to break even
- **AI explanation** — after each decision, an AI coach explains why your play was correct or not, using the exact EV numbers from the hand
- **Session stats** — track correct decision rate and EV lost by hand category

---

## Hand categories

| Category | What it means |
|----------|--------------|
| **Nuts** | You have the best possible hand — nothing beats you |
| **Strong value** | A very strong hand (set, straight, flush, non-nut full house) |
| **Marginal** | A medium hand — the right play is less obvious |
| **Bluff catcher** | A hand that beats bluffs but loses to value |
| **Air** | You missed — pure bluff territory |

---

## Tips for getting the most out of it

- **Filter by one category** to drill a specific leak (e.g. only bluff catchers if you call too often)
- **Try the wrong action first** on purpose to see how much EV you lose
- **Use the hint sparingly** — figure out the break-even fold frequency yourself before revealing it
- **Focus on the EV bar chart** — even when correct, check how far apart the options are

---

## Setup (optional — AI explanations)

The app works without any setup. If you want AI-powered explanations after each decision:

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. Create a `.env.local` file in the project root:
   ```
   VITE_GROQ_API_KEY=your_key_here
   ```
3. Restart the dev server

Without a key, the app falls back to a static explanation for each scenario.
