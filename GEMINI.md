# Project Overview: Exchange Rates with NBP API

This is a React 19 application built with TypeScript and Vite that fetches and displays exchange rates from the National Bank of Poland (NBP) API. It provides a user interface to select different rate tables (A, B, C), search for specific currencies, and visualize historical trends using a custom Canvas-based charting component.

## Architecture

- **`App.tsx`**: The main entry point and orchestrator. It manages the global state for the selected table, currency code, and date range.
- **`SendFetch.tsx`**: A versatile component used for fetching data from the NBP API. It handles both searching for currency codes (populating a datalist) and displaying the current rates in a tabular format.
- **`Graff.tsx`**: Implements the logic for calculating and drawing historical exchange rate trends. It processes raw data from the API and maps it to coordinates for the canvas.
- **`Canvas.tsx`**: A reusable, low-level wrapper for the HTML5 `<canvas>` element, providing a declarative way to integrate imperative drawing logic into the React component tree.
- **`waluty.scss`**: Centralized styling for the application using Sass.

## Building and Running

The project uses standard Vite scripts for development and deployment:

### Local Development
```bash
npm install
npm run dev
```
Starts the development server on `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Compiles TypeScript and bundles the application for production. Note: The build is configured with a base path of `/exchange-rates-with-NBP-API` for GitHub Pages compatibility.

### Deployment
```bash
npm run deploy
```
Triggers a production build (`predeploy`) and pushes the `dist` directory to the `gh-pages` branch.

### Configuration
The application relies on a global `API_URL` constant, which is injected by Vite during the build process. This is typically configured via environment variables (e.g., `.env` file):
- `API_URL`: The base URL for the NBP API (e.g., `https://api.nbp.pl/api/exchangerates`).

## Development Conventions

- **React 19 & Hooks**: Adheres to modern React patterns, utilizing `useState`, `useEffect`, and `useRef` for side effects and DOM manipulation.
- **TypeScript**: Strictly typed components and interfaces for API responses (see `RateRow`, `TableData`, `Rate` interfaces in `SendFetch.tsx` and `Graff.tsx`).
- **Canvas-based Visualization**: Prefer the custom `Canvas` component for performance-sensitive drawing operations rather than heavy charting libraries.
- **Styling**: Use Sass for modular and maintainable CSS.
- **Error Handling**: API calls include basic error states and loading indicators to improve UX.
