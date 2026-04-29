/** Raw blueprint graph payload from action-blueprint-graph-get — see docs/api.MD */

export interface BlueprintGraphNode {
  id: string
  type: string
  position?: { x: number; y: number }
  data: Record<string, unknown>
}

export interface BlueprintGraphEdge {
  id?: string
  source: string
  target: string
}

export interface BlueprintGraphForm {
  id: string
  name?: string
  description?: string
  is_reusable?: boolean
  field_schema?: Record<string, unknown>
  ui_schema?: unknown
  dynamic_field_config?: Record<string, unknown>
}

export interface BlueprintGraphResponse {
  id?: string
  tenant_id?: string
  name?: string
  description?: string
  nodes: BlueprintGraphNode[]
  edges: BlueprintGraphEdge[]
  forms: BlueprintGraphForm[]
}
