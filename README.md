# Avantos workflow builder

React + TypeScript + Vite app for the blueprint graph workflow (`docs/` has requirements and API notes).

## Prerequisites

- **Node.js** LTS (recommended **20.x** or **22.x**).

You need **two terminals**: one for the challenge mock server (“backend”), one for this React app (“frontend”).

## How to start the project

### 1. Start the backend (challenge mock server)

In your workspace, open the **frontend challenge server** project folder (the one that contains `graph.json` and `npm start`).

Install dependencies and start the server:

```bash
npm install
npm start
```

Leave this running. It listens on **http://localhost:3000** and serves the mock graph JSON.

### 2. Start the frontend (this app)

From the root of **this** repository (`avantosTest`):

```bash
npm install
npm run dev
```

When Vite prints a local URL (usually **http://localhost:5173**), open it in the browser. The UI will fetch the graph from the mock.

**Important:** Always start **step 1** before **step 2**. If the mock is not running, requests from the app will fail.

### Mock URL vs `docs/api.MD`

The real API path in `docs/api.MD` includes `blueprint_version_id`. The challenge mock uses a shorter path; this app matches that mock only.

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm install`        | Install dependencies         |
| `npm run dev`        | Dev server (Vite)            |
| `npm run build`      | Typecheck + production build |
| `npm run preview`    | Preview production build       |
| `npm run test`       | Vitest (single run)          |
| `npm run test:watch` | Vitest (watch mode)          |
| `npm run lint`       | ESLint                       |

## Tests

[Vitest](https://vitest.dev/) runs on **`npm run test`** (configured in [`vite.config.ts`](vite.config.ts)).

Tests live next to the feature they cover: **`src/<feature>/__tests__/*.test.ts`** (for example [`src/api/__tests__/graph.test.ts`](src/api/__tests__/graph.test.ts) exercises [`src/api/graph.ts`](src/api/graph.ts)).

## Configuration

Optional: copy [`.env.example`](.env.example) to `.env` to override `VITE_*` values. Defaults live in [`src/config.ts`](src/config.ts) (they target `http://localhost:3000`). Do not commit `.env`.

See [`docs/git.md`](docs/git.md) for commit message notes.

## Docs

Requirements, architecture, and examples: [`docs/`](docs/).
