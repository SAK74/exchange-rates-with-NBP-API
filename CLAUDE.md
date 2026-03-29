# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Type-check + production build to /dist
npm run preview   # Preview production build
```

No test runner is configured.

## Environment

Both `SendFetch.tsx` and `Graff.tsx` fetch from the global `API_URL`, which Vite injects at build/dev time via `define` in `vite.config.ts`. You must set it in a `.env` file:

```
API_URL=https://api.nbp.pl/api/exchangerates
```

## Architecture

Single-page React app that fetches and visualizes exchange rates from the **NBP API** (Polish National Bank).

### Key Files

- `src/App.tsx` — root component; owns all state (`table`, `symbol`, `startDate`); renders the form UI (currency picker, table A/B/C selector, date range) and composes `SendFetch` + `Graff`
- `src/SendFetch.tsx` — fetches `tables/{table}/` on mount (re-fetches when `table` changes); used in two modes: `search` (renders `<option>` elements into a `<datalist>`, filtered client-side) and display (always renders the full rates `<table>`, with `code` prop only controlling the `selected` CSS highlight)
- `src/Graff.tsx` — fetches historical rates and draws a line chart via the Canvas API; for table C plots `(ask+bid)/2`; for A/B plots `mid`
- `src/Canvas.tsx` — reusable canvas wrapper; accepts `width`, `height`, `draw` callback, and optional `children` rendered alongside the canvas; calls `draw(ctx)` on every render via `useEffect` (no deps array)
- `src/waluty.scss` — all styles (SCSS with nesting)

### API

Base URL: `API_URL` env var (e.g. `http://api.nbp.pl/api/exchangerates`)

- `tables/{table}/` — current rates for table A, B, or C
- `rates/{table}/{code}/{startDate}/{endDate}/` — historical rates for charting

Table C returns `bid`/`ask` rates; tables A and B return `mid` rates.

### Stack

- React 19 + Vite 6 + TypeScript 5
- `sass` for SCSS compilation
- `babel-plugin-react-compiler` (React Compiler enabled via `@vitejs/plugin-react`)
- No routing, no global state management — all state is local via `useState`
- Canvas-based chart drawing (no chart library)

## Deployment

The app is deployed to GitHub Pages. The build script sets `--base /exchange-rates-with-NBP-API`. Deploy with `gh-pages` (devDependency).
