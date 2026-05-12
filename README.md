# Poker EV Trainer

A mobile-first training app to sharpen your poker decision-making at the river. Face real hand scenarios, pick an action, and instantly see whether you made the highest-EV play — and by how much.

---

## What is EV?

**Expected Value (EV)** is how much money a decision makes on average over time. A +EV play makes you money in the long run. A -EV play costs you money, even if you win the hand sometimes.

Good poker is about consistently choosing the highest-EV action — not about short-term results.

---

## How it works

1. **Pick a scenario** from the home screen — filter by difficulty or hand category
2. **Read the situation** — you'll see the board, your hand, the pot size, villain type, and what the villain did
3. **Choose your action** — Fold, Check, Call, or one of the bet sizes
4. **See your result** — the app shows the EV of every action, highlights the optimal play, and explains the reasoning

Each scenario features a different villain type with realistic tendencies:

| Villain | Style |
|---------|-------|
| **Nit** | Folds very often, only bets strong hands |
| **TAG** | Balanced, folds a reasonable amount |
| **LAG** | Aggressive, calls and bluffs more |
| **Fish** | Calls too wide, rarely folds |

---

## Features

- **20 river scenarios** — beginner to advanced, covering value, bluffs, bluff catchers, and marginal spots
- **Real EV math** — every action is calculated using pot odds, fold equity, and equity vs the villain's range
- **Pot odds hint** — when the villain bets, you see exactly how much equity you need to call profitably
- **Bluff hint** — when you're the bettor, you can reveal how often the villain needs to fold for your bluff to break even
- **AI explanation** — after each decision, an AI coach explains specifically why your play was correct or incorrect, using the actual numbers from the hand
- **Session stats** — track your correct decision rate and EV lost across categories over a session

---

## Hand categories

| Category | What it means |
|----------|--------------|
| **Nuts** | You have the best or near-best possible hand |
| **Strong value** | A strong hand that wants to build the pot |
| **Marginal** | A medium hand — the right play is less obvious |
| **Bluff catcher** | A hand that beats bluffs but loses to value |
| **Air** | You missed — pure bluff territory |

---

## Tips for getting the most out of it

- **Try the wrong action first** on purpose to see how much EV you lose
- **Use the hint sparingly** — try to figure out the break-even fold frequency before revealing it
- **Focus on the EV bar chart** — even when you pick correctly, check how far apart the options are
- **Filter by category** to drill a specific leak (e.g. only bluff catchers if you call too much)

---

## Setup (optional — AI explanations)

The app works without any setup. If you want AI-powered explanations:

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. Create a `.env.local` file in the project root:
   ```
   VITE_GROQ_API_KEY=your_key_here
   ```
3. Restart the dev server

Without a key, the app falls back to static explanations for every scenario.
