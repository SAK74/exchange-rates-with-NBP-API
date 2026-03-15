# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:5173
npm run build     # Type-check + production build to /dist
npm run preview   # Preview production build
```

No test runner is configured.

## Architecture

Single-page React app that fetches and visualizes exchange rates from the **NBP API** (Polish National Bank).

**Important:** The NBP API only accepts requests from HTTP origins, not HTTPS. The app must be served over HTTP (dev server is HTTP by default).

### Key Files

- `src/main.tsx` — entry point, mounts `<App>`
- `src/App.tsx` — root component; owns all state (`table`, `symbol`, `startDate`); renders the form UI (currency picker, table A/B/C selector, date range) and composes `SendFetch` + `Graff`
- `src/SendFetch.tsx` — fetches `tables/{table}/` on mount (re-fetches when `table` changes); used in two modes: `search` (renders `<option>` elements into a `<datalist>`) and display (renders the full rates `<table>`)
- `src/Graff.tsx` — fetches historical rates and draws a line chart via the Canvas API
- `src/Canvas.tsx` — reusable canvas wrapper; accepts a `draw` callback and `size` prop, calls `draw(ctx)` via `useEffect`
- `src/waluty.scss` — all styles (SCSS with nesting)

### API

Base URL: `http://api.nbp.pl/api/exchangerates/`

- `tables/{table}/` — current rates for table A, B, or C
- `rates/{table}/{code}/{startDate}/{endDate}/` — historical rates for charting

Table C returns `bid`/`ask` rates; tables A and B return `mid` rates.

### Stack

- React 19 + Vite 6 + TypeScript 5
- `sass` for SCSS compilation
- `babel-plugin-react-compiler` (React Compiler enabled via `@vitejs/plugin-react`)
- No routing, no global state management — all state is local via `useState`
- Canvas-based chart drawing (no chart library)
