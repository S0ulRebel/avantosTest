# Requirements

## General

- Simplified workflow builder
- Nodes represent steps in a workflow
- Each node references a form via `component_id`; **different nodes may reuse the same form id**
- Forms are stored separately as a registry
- Nodes are connected in a Directed Acyclic Graph (DAG)
- Data flows forward between forms

## Flow

- Fetch graph JSON from the blueprint graph GET endpoint (`action-blueprint-graph-get`; URL and shape in `api.MD`)
- Use the provided mock server
- Render workflow **steps** (nodes) in a simple list, labeled using each node’s resolved form (no graph canvas required)

## Graph

- Nodes may have direct dependencies (via edges)
- Nodes may have transitive dependencies
- Traverse the DAG to collect all upstream nodes
- Resolve nodes → forms via component_id mapping
- This is used to determine available prefill sources

## Data & prefill

- Each form has fields
- Fields can be prefilled from a data source
- Supported sources:
  - Direct dependencies
  - Transitive dependencies
  - Global data (mocked)
- Design for pluggable data sources so new ones can be added without changing existing logic

## Prefill behavior

- Per field: show current mapping if one exists, otherwise show "no mapping"
- User can add, change, or remove a mapping
- Adding/editing opens a modal to pick from available data sources

## UI

- List of **nodes** (steps), typically showing resolved **form** title/description per row
- Pick a **node** (step) to see that step’s fields
- Show fields and their mappings
- Modal for selecting prefill source

## State

- Track selected **node id** (each row is one graph node; resolve fields via that node’s `component_id` → form schema)
- Track field-to-source **mappings scoped per node id** (not only per form id, since multiple nodes can share a form)
- No backend persistence

## Edge cases

- Forms with no dependencies
- Fields with no available data sources
- Empty states

## Testing

- Unit tests for graph traversal (upstream dependency resolution)
- Unit tests for mapping logic

## Acceptance criteria

- Load graph data from the API (mock) and derive nodes, edges, and forms as described in `api.MD`
- List **nodes** (steps), resolve labels/forms via `component_id`, and open a step’s fields by **selected node id**
- Show each field’s mapping or “no mapping”; user can add, change, or remove mappings via the modal
- Prefill options reflect direct/transitive upstream nodes (resolved to forms/fields) plus global source where applicable
- Unit tests cover graph traversal and mapping logic

## Notes

- Visual DAG rendering is out of scope (OK to add later if time permits)
- UI can be a simple list-based representation
- The goal is data flow and mapping logic, not visualization
