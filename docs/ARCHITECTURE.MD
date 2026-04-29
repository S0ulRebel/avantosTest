# Architecture

## Overview

- Simplified workflow builder: each step is a **node**; nodes reference forms via `component_id` (same form id may appear on multiple nodes)
- Fields can be prefilled from upstream dependencies or other data sources
- Goals: modular, extensible, testable; core logic stays UI-agnostic

## Technology stack

- React - UI
- TypeScript - types
- Vite - build / dev
- React hooks - state
- Vitest + React Testing Library - tests

## Folder structure

- src/
  - api/
    - `__tests__/` — Vitest specs beside the module they test (e.g. `graph.test.ts` for `graph.ts`)
  - core/
    - graph/
  - data-sources/
  - state/
  - ui/
    - components/
  - types/

## Layer responsibilities

### api/

- Talks to the mock server / backend
- Fetches raw graph JSON via the blueprint graph GET endpoint (`action-blueprint-graph-get`; URL in `api.MD`)
- Minimal normalization only (no domain rules here)

### core/

- Pure domain logic; no React
- core/graph turns the API response into a normalized in-memory model

Two linked pieces in the payload:

- Graph structure (nodes + edges)
- Form registry (forms)

Nodes reference forms via `component_id` (not necessarily unique per node).

Core outputs (aligned with solution.MD):

- nodesById - graph nodes keyed by id
- formsById - form registry
- adjacencyList - node id to downstream node ids
- reverseAdjacencyList - node id to upstream node ids

Implements:

- DFS/BFS traversal
- Direct and transitive dependency resolution

- Intended to stay framework-agnostic and unit-testable

### data-sources/

- Turns graph + global/mock data into selectable prefill options
- Shared interface so each source returns the same kind of option shape for the UI
- Covers direct deps, transitive deps, global (mocked)
- New sources should plug in without rewriting core or UI

### state/

- React hooks hold selected **node id**, field mappings keyed by **node id**, light UI state
- Mappings are the source of truth for prefill configuration per step
- No Redux/etc. for this scope

### ui/

- Presentation only; delegates behavior to core and data-sources

#### components/

- FormList, FormDetails, FieldMappingRow, MappingModal
- Prefer reusable, mostly presentational pieces where it makes sense

### types/

- Shared TS types: graph, forms, mappings, data-source contracts
- Keeps layers aligned

## UI structure

- Small reusable pieces (inputs, rows, buttons)
- Domain-focused pieces (FormDetails, MappingModal)
- Screen-level composition on top
- Inspired by atomic-ish ideas but not a strict taxonomy

## Data flow

- API loads raw graph (nodes + edges + forms)
- Core builds normalized DAG (indexes + lists)
- Graph helpers compute direct / transitive dependencies
- Data sources turn dependencies into prefill options
- UI lists **nodes**, resolves the form per row via `component_id`, shows fields and mappings for the **selected node**
- State stores **selected node id** and mapping edits per node

## Design principles

- Split UI, domain logic, and data access
- Keep core testable without React
- Keep graph math out of components where practical
- Data sources stay pluggable
- Prefer declarative UI driven by state

## Extensibility

- New data source: implement the shared interface; avoid edits scattered across core/UI
- Graph helpers can grow inside core without touching UI
- UI stays composable from small components

## Coding conventions

- Functional components
- No business rules hiding only in UI - core + data-sources own domain logic
- Prefer composition
- Strong typing in domain code; avoid `any` in core
- Small, pure functions where possible
- camelCase for functions/vars; PascalCase for components

## Non-goals

- Editing the graph in the UI
- Backend persistence
- Visual DAG canvas (optional later elsewhere)

## Error handling

- At this scope, keep failure handling minimal: if the graph request fails or returns unusable data, show a simple inline message or banner and optionally retry; no requirement for full retry policies, error boundaries everywhere, or telemetry.

## Testing strategy

- Unit tests beside modules under **`src/…/__tests__/`** (e.g. `src/api/__tests__/graph.test.ts`)
- Graph traversal (DFS/BFS) and dependency results
- Data source aggregation
- Mapping create / update / delete
- Core stays easy to test without mounting React

## Edge cases

- No dependencies → rely mainly on global mock data
- Empty form → empty UI state
- Duplicate upstream paths → dedupe in traversal
- **Multiple nodes, same `component_id`** → UI/state still distinguish rows by **node id**
- Clear mapping → field shows “no mapping” again

## Notes

- Persistence not required for the assignment
- Optional later: visual DAG, persist mappings (localStorage or API)
