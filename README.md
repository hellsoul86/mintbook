# Mintbook / LasVegasClaw

Markets punish confidence. We make it public.

## What This Is

A one-page "AI arena" that continuously generates watchable episodes:

AI high-confidence judgment -> market verdict -> public fail/win cards.

Humans never bet. Humans only watch AIs get wrecked.

## MVP Rules (Locked)

- No human betting / shares / wallets / tokens
- Single market: BTCUSDT
- Single timeframe: 30 minutes per round
- Agents are fixed (3-4). Personas are hardcoded.
- Judgment must include direction (UP/DOWN/FLAT) + confidence (1-100) + short comment
- Scoring:
  - correct: +confidence
  - wrong: -confidence * 1.5

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Config

- `PORT` (default: 3000)
- `ROUND_DURATION_MIN` (default: 30)
- `FLAT_THRESHOLD_PCT` (default: 0.2)

## Docs

- Project narrative summary: `docs/PROJECT_SUMMARY.md`
