import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildBlueprintGraphUrl, fetchActionBlueprintGraph } from '../graph'

/** Resolved `fetch` mock — pass a minimal Response-shaped object */
function mockResolvedFetch(response: {
  ok: boolean
  json?: () => Promise<unknown>
  text?: () => Promise<string>
  status?: number
  statusText?: string
}) {
  return vi.fn().mockResolvedValue({
    status: response.ok ? 200 : 404,
    statusText: response.ok ? 'OK' : 'Not Found',
    ...response,
    json: response.json ?? (async () => ({})),
    text: response.text ?? (async () => ''),
  })
}

describe('buildBlueprintGraphUrl', () => {
  it('matches mock route shape', () => {
    expect(
      buildBlueprintGraphUrl('http://localhost:3000/api/v1/', '123', 'bp_456'),
    ).toBe(
      'http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph',
    )
  })
})

describe('fetchActionBlueprintGraph', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1')
    vi.stubEnv('VITE_TENANT_ID', '123')
    vi.stubEnv('VITE_ACTION_BLUEPRINT_ID', 'bp_456')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns parsed JSON when response is OK', async () => {
    const body = {
      nodes: [{ id: 'n1', type: 'form', data: {} }],
      edges: [],
      forms: [],
    }
    const fetchMock = mockResolvedFetch({
      ok: true,
      json: async () => body,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchActionBlueprintGraph()).resolves.toEqual(body)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('throws GraphApiError when HTTP status is not OK', async () => {
    vi.stubGlobal(
      'fetch',
      mockResolvedFetch({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => '{"error":"not found"}',
      }),
    )

    await expect(fetchActionBlueprintGraph()).rejects.toMatchObject({
      name: 'GraphApiError',
      message: 'Request failed: 404 Not Found',
      status: 404,
      details: '{"error":"not found"}',
    })
  })

  it('throws GraphApiError when fetch fails (network)', async () => {
    const cause = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(cause))

    await expect(fetchActionBlueprintGraph()).rejects.toMatchObject({
      name: 'GraphApiError',
      message: 'Network request failed',
      cause,
    })
  })
})
