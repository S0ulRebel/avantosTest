import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./api/graph', () => ({
  fetchActionBlueprintGraph: vi.fn(() =>
    Promise.resolve({
      nodes: [{ id: 'n1', type: 'form', data: {} }],
      edges: [],
      forms: [{ id: 'f1' }],
    }),
  ),
  GraphApiError: class GraphApiError extends Error {
    name = 'GraphApiError'
  },
  buildBlueprintGraphUrl: vi.fn(),
}))

describe('App', () => {
  it('renders workflow builder title and loads graph JSON', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Avantos workflow builder',
    )
    expect(await screen.findByText(/"nodes"/)).toBeInTheDocument()
    expect(await screen.findByText(/"id": "n1"/)).toBeInTheDocument()
  })
})
