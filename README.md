# Avantos workflow builder

React + TypeScript + Vite app for the blueprint graph workflow (see `docs/`).

## Prerequisites

Use a current **Node.js LTS** (recommended **22.12+** or **20.19+**).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm install`     | Install dependencies     |
| `npm run dev`     | Dev server (Vite)        |
| `npm run build`   | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run test`    | Vitest (single run)      |
| `npm run test:watch` | Vitest (watch mode)   |
| `npm run lint`    | ESLint                   |

## Configuration

- Copy [`.env.example`](.env.example) to `.env` if you need to override the API base URL (`VITE_API_BASE_URL`). Do not commit `.env`.
- Commit messages: see [`docs/git.md`](docs/git.md).

## Docs

Requirements, API shape, architecture, and examples live under [`docs/`](docs/).
