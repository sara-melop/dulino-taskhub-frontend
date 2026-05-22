# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js Version Warning

This project uses **Next.js 16**, which has breaking changes from earlier versions. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. APIs, conventions, and file structure may differ from training data. Heed deprecation notices.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run all tests with Vitest
```

To run a single test file:
```bash
npx vitest run tests/TaskForm.test.jsx
```

## Architecture

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · Axios · Vitest + React Testing Library

### Routing & Pages

All routes live under `src/app/` using the App Router:
- `/` — redirects to `/tasks` if a JWT is in localStorage, otherwise to `/login`
- `/login`, `/register` — unauthenticated entry points
- `/tasks` — protected main dashboard

### Auth

JWT token is stored in `localStorage`. `src/services/api.js` is an Axios instance that auto-injects the token as a `Bearer` header on every request and redirects to `/login` on any 401.

### State & Data

Task CRUD state lives entirely in `src/hooks/useTasks.js`. Components import this hook; there is no global task store. Theme (light/dark) is the only piece of global state, managed by `src/context/ThemeContext.jsx` and persisted to localStorage.

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default: `http://localhost:3001`) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | Placeholder — weather uses Open-Meteo/Nominatim, not OpenWeather |

### Testing

Tests live in `tests/` and use Vitest with jsdom + React Testing Library. The setup file is `tests/setup.js`. Existing test files cover `TaskForm` and `TaskItem` components.
