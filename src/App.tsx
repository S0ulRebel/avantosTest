import { useEffect, useState } from 'react'
import './App.css'
import { fetchActionBlueprintGraph, GraphApiError } from './api/graph'
import type { BlueprintGraphResponse } from './types/graphApi'

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: BlueprintGraphResponse }
  | { status: 'error'; message: string }

function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetchActionBlueprintGraph()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        let message: string
        if (e instanceof GraphApiError) {
          message = e.details ? `${e.message} — ${e.details}` : e.message
        } else if (e instanceof Error) {
          message = e.message
        } else {
          message =
            typeof e === 'string'
              ? e
              : JSON.stringify(e, undefined, 2)
        }
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app-shell">
      <h1>Avantos workflow builder</h1>
      <p className="app-intro">Blueprint graph payload (mock server).</p>

      {state.status === 'loading' && (
        <p className="app-status" role="status">
          Loading graph…
        </p>
      )}

      {state.status === 'error' && (
        <p className="app-error" role="alert">
          {state.message}
        </p>
      )}

      {state.status === 'success' && (
        <pre className="app-json">
          <code>{JSON.stringify(state.data, null, 2)}</code>
        </pre>
      )}
    </main>
  )
}

export default App
