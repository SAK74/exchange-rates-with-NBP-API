# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm start         # Dev server at http://localhost:3000
npm run build     # Production build to /build
npm test          # Run Jest tests
```

## Architecture

Single-page React app that fetches and visualizes exchange rates from the **NBP API** (Polish National Bank).

**Important:** The NBP API only accepts requests from HTTP origins, not HTTPS. The app must be served over HTTP.

### Key Files

- `src/index.js` — entry point, mounts `<Main>` from `kursy_walut.js`
- `src/kursy_walut.js` — entire app logic in one file; contains three components:
  - `Main` — form UI: currency symbol picker, table selector (A/B/C), date range inputs
  - `Graff` — renders a historical rate line chart using the Canvas API
  - `SendFetch` — fetches and displays the rates table
- `src/Canvas.js` — reusable canvas wrapper; accepts a `draw` callback and `size` prop, calls `draw(ctx)` via `useEffect`
- `src/waluty.scss` — all styles (SCSS with nesting)

### API

Base URL: `http://api.nbp.pl/api/exchangerates/`

- `tables/{table}/` — current rates for table A, B, or C
- `rates/{table}/{code}/{startDate}/{endDate}/` — historical rates for charting

Table C returns `bid`/`ask` rates; tables A and B return `mid` rates.

### Stack

- React 17 + Create React App (no eject, no TypeScript)
- `node-sass` for SCSS compilation
- No routing, no global state management — all state is local via `useState`
- Canvas-based chart drawing (no chart library)
