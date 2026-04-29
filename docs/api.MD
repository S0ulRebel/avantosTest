# API

## What this is

- REST response describes a workflow graph (DAG) for an action blueprint
- The app uses it to build the graph, resolve dependencies, map nodes to forms, and drive field-level prefill

## What we use from the response

- nodes — graph structure
- edges — relationships between nodes
- forms — form schema registry
- Everything else in the payload can be ignored for this app

## Endpoint

- GET `/{tenant_id}/actions/blueprints/{action_blueprint_id}/{blueprint_version_id}/graph`
- Base URL: `https://admin-ui.dev-sandbox.workload.avantos-ai.net/api/v1`
- Other docs call this resource **action-blueprint-graph-get** (logical name for the same HTTP request).
- Example response body: [`responseExample.json`](responseExample.json) (same folder as this file).

## Response (200)

### Top level

- id, tenant_id, name (metadata as returned)
- nodes — array
- edges — array
- forms — array
- branches, triggers — present but unused here

### Nodes

- Each node is a step in the workflow graph
- id — string
- type — string
- position — x, y numbers (for any future layout)
- data — main payload:
  - id — string
  - component_id — string; ties this node to a form (`Form.id`)
  - component_key, component_type — strings
  - name — string
  - prerequisites — string array
  - input_mapping — object (opaque for this use case)
- Used for: DAG structure, traversal input, representing steps

### Edges

- Directed: source node id → target node id
- Used for: direct and transitive dependency resolution

### Forms

- id — string (matches `node.data.component_id`; several nodes may point at one form id)
- name, description — strings
- is_reusable — boolean
- field_schema — JSON Schema style object with properties (and optional required keys)
- ui_schema — present; shape varies
- dynamic_field_config — optional object
- Used for: field definitions, rendering targets, prefill target fields

## Node ↔ form link

- `node.data.component_id === form.id` connects the graph layer to the schema layer
- **Multiple nodes may share the same `component_id`** (same form reused at several steps). Graph identity for traversal and UI rows is always **`nodes[].id`**, not form id alone.

## Derived model (in the app)

- Normalize into something like:
  - nodesById
  - formsById
  - adjacencyList (node → downstream ids)
  - reverseAdjacencyList (node → upstream ids)

## Data flow (high level)

- Fetch JSON
- Build graph from nodes + edges
- Build adjacency and reverse adjacency lists
- Traverse (DFS/BFS) for dependencies
- Resolve forms using component_id
- Feed resolved structure into prefill

## Ignored / out of scope for this doc

- branches
- triggers
- workflow orchestration beyond structure
- state machines, execution, SLA, approvals

## Short summary

- Nodes — structure and traversal (each row/step id is `nodes[].id`)
- Edges — dependencies
- Forms — schemas and fields
- component_id — joins nodes to forms (not unique across nodes)
- Traversal runs on nodes; forms attach when resolving data for UI
