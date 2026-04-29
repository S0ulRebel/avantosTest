const DEFAULT_CHALLENGE_MOCK_ENV = {
  VITE_API_BASE_URL: 'http://localhost:3000/api/v1',
  VITE_TENANT_ID: '123',
  VITE_ACTION_BLUEPRINT_ID: 'bp_456',
} as const

export type ActionBlueprintGraphClientConfig = {
  apiBaseUrl: string
  tenantId: string
  actionBlueprintId: string
}

export function getActionBlueprintGraphClientConfig(): ActionBlueprintGraphClientConfig {
  return {
    apiBaseUrl:
      import.meta.env.VITE_API_BASE_URL ??
      DEFAULT_CHALLENGE_MOCK_ENV.VITE_API_BASE_URL,
    tenantId:
      import.meta.env.VITE_TENANT_ID ??
      DEFAULT_CHALLENGE_MOCK_ENV.VITE_TENANT_ID,
    actionBlueprintId:
      import.meta.env.VITE_ACTION_BLUEPRINT_ID ??
      DEFAULT_CHALLENGE_MOCK_ENV.VITE_ACTION_BLUEPRINT_ID,
  }
}
