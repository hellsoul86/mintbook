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

Open (default from `serve`):

```text
http://localhost:3000
```

## API Base

This is now a static front-end. Configure the API host by setting
`window.MINTBOOK_API_BASE` in `public/index.html`. Leave it empty for
same-origin or reverse-proxy setups.

## Docs

- Project narrative summary: `docs/PROJECT_SUMMARY.md`
