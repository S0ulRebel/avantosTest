import { getActionBlueprintGraphClientConfig } from '@/config'
import type { BlueprintGraphResponse } from '@/types/graphApi'

export class GraphApiError extends Error {
  readonly status: number | undefined
  readonly details: string | undefined

  constructor(
    message: string,
    options?: { status?: number; details?: string; cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined)
    this.name = 'GraphApiError'
    this.status = options?.status
    this.details = options?.details
  }
}

/** Matches the challenge mock route (short path; see README / docs/api.MD for full API). */
export function buildBlueprintGraphUrl(
  baseUrl: string,
  tenantId: string,
  actionBlueprintId: string,
): string {
  const base = baseUrl.replace(/\/$/, '')
  const path = `/${encodeURIComponent(tenantId)}/actions/blueprints/${encodeURIComponent(actionBlueprintId)}/graph`
  return `${base}${path}`
}

export async function fetchActionBlueprintGraph(
  init?: { signal?: AbortSignal },
): Promise<BlueprintGraphResponse> {
  const { apiBaseUrl, tenantId, actionBlueprintId } =
    getActionBlueprintGraphClientConfig()
  const url = buildBlueprintGraphUrl(apiBaseUrl, tenantId, actionBlueprintId)

  let response: Response
  try {
    response = await fetch(url, {
      signal: init?.signal,
      headers: { Accept: 'application/json' },
    })
  } catch (e) {
    const cause = e instanceof Error ? e : new Error(String(e))
    throw new GraphApiError('Network request failed', { cause })
  }

  if (!response.ok) {
    const text = await response.text()
    throw new GraphApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      {
        status: response.status,
        details: text.slice(0, 500),
      },
    )
  }

  const data = await response.json()
  return data as BlueprintGraphResponse
}
