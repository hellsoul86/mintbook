# Mintbook / BullBear Brief (Frontend)

React + Vite + TypeScript front-end for the BullBear Brief experience (bull/bear reasons and live comparisons).

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## API Base

Configure the API host with `VITE_API_BASE`:

```bash
cp .env.example .env
```

Set:

```
VITE_API_BASE=https://book-lasvegas-api.hellsoul86.workers.dev
```

Leave it empty for same-origin or reverse-proxy setups.

## Language

Default language is English. Use the in-app toggle to switch between English and Chinese.
The preference is saved in `localStorage` under `mintbook_lang`.

## Build

```bash
npm run build
npm run preview
```

## Docs

- Project narrative summary: `docs/PROJECT_SUMMARY.md`
