# Solution

## General

- React + TypeScript app
- Fetch and normalize graph data from the API
- Represent nodes and their relationships as a DAG in memory
- Resolve forms separately via form registry (`component_id` mapping); **multiple nodes may share one form id**
- Keep the UI simple and functional (no node-based graph rendering required)

## Architecture

Split into layers:

- API layer (fetching)
- Graph logic (DAG traversal)
- Data sources (prefill providers)
- UI (presentation + interaction)
- State (React state)

(Project folder structure mirrors these layers)

## Data fetching

- Call the blueprint graph GET endpoint (`action-blueprint-graph-get`; see `api.MD`)
- Normalize response into:
  - nodesById map (graph nodes)
  - formsById map (form registry)
  - adjacency list (node id → downstream node ids)
  - reverse adjacency list (node id → upstream node ids)

## Graph traversal

- Utilities: getDirectDependencies(nodeId), getAllDependencies(nodeId)
- Assume the API returns a valid DAG (no cycles)
- Traverse and dedupe **upstream node ids**; resolve nodes to forms via `component_id` when building prefill options or UI labels
- Dependency lists are derived from the graph and not stored in state

## Data sources (extensible)

- Common interface:
interface DataSource {
  id: string;
  getFields(nodeId: string): PrefillOption[];
}

- Prefill option shape:
type PrefillOption = {
  label: string;
  value: {
    sourceType: string;
    formId?: string;
    fieldId: string;
  };
};

- Implement:
 - DirectDependencySource
 - TransitiveDependencySource
 - GlobalSource (mocked)

- Combine options via flatMap over sources so new sources plug in without changing existing logic

## Prefill mapping

- Local state only; mappings belong to a **graph node** (target step), not only to a form id

- Mapping shape:
type Mapping = {
  targetFieldId: string;
  source: {
    type: string; // direct | transitive | global
    nodeId?: string;
    formId?: string;
    fieldId: string;
  };
};

- Support CRUD operations for mapping

## State management

- React state is enough (no extra library required)
- Track selected **node id** (or null); derive display form from `nodesById[nodeId].data.component_id` → `formsById`
- Track mappings **per node id** (e.g. `Record<nodeId, Mapping[]>`), since two nodes can share the same form

## UI

- FormList - all graph nodes (resolved to forms for labels)
- FormDetails - fields for the **selected node’s** form (`component_id`)
- FieldMappingRow - one row per field / mapping
- MappingModal - pick a prefill source
- Flow: select **node** → see fields → unmapped field opens modal → pick option creates or updates mapping → remove clears mapping

## Modal (prefill selection)

- Group options: direct deps, transitive deps, global data
- Each option shows source form and field name (as needed)

## Edge cases

- No dependencies → mostly global data
- No fields → empty state
- Duplicate upstream paths → dedupe in traversal results
- **Several nodes share the same `component_id`** → keep selection and mappings keyed by **node id**
- Removing a mapping → field shows “no mapping” again

## Testing

- Graph traversal (direct + transitive)
- Data source aggregation
- Mapping add / update / remove

## Performance

- Optionally cache traversal results per **node id**
- Avoid redoing dependency work when nothing changed

## Extensibility

- New data sources = implement the shared interface; UI picks them up
- Keep graph logic separate so it stays reusable

## Notes

- No backend persistence
- No in-app graph editing
- Graph traversal operates on nodes; forms are resolved only at the UI/data-source layer
- Optional later: visual DAG, or persist mappings in localStorage
