import { useState, useCallback, useEffect, type CSSProperties } from 'react'
import Header from './components/Header'
import MoodPicker from './components/MoodPicker'
import YearInPixels from './components/YearInPixels'
import TokenSetup from './components/TokenSetup'
import TokenUnlock from './components/TokenUnlock'
import { useMoodData } from './hooks/useMoodData'
import { useTheme } from './hooks/useTheme'
import { hasEncryptedToken, resolveGist } from './lib/gist'
import type { AppState } from './types'

type ViewTab = 'today' | 'year'

function resolveInitialState(): AppState {
  return hasEncryptedToken() ? 'unlock' : 'setup'
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(resolveInitialState)
  const [errorMsg, setErrorMsg] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [view, setView] = useState<ViewTab>('today')
  const { moods, setMood, syncStatus, setSession, syncFromGist } = useMoodData()
  const { theme, toggleTheme } = useTheme()

  const handleTokenReady = useCallback(async (decryptedToken: string) => {
    setToken(decryptedToken)
    setAppState('loading')
    try {
      const gistId = await resolveGist(decryptedToken)
      setSession(decryptedToken, gistId)
      setAppState('ready')
    } catch (err) {
      setErrorMsg((err as Error).message)
      setAppState('error')
    }
  }, [setSession])

  useEffect(() => {
    if (appState === 'ready') {
      syncFromGist()
    }
  }, [appState, syncFromGist])

  const handleRetry = () => {
    if (token) {
      handleTokenReady(token)
    } else {
      setAppState(resolveInitialState())
    }
  }

  const shellStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column', height: '100%',
    maxWidth: '32rem', margin: '0 auto', width: '100%',
  }

  if (appState === 'setup') {
    return <div style={shellStyle}><TokenSetup onDone={handleTokenReady} /></div>
  }

  if (appState === 'unlock') {
    return <div style={shellStyle}><TokenUnlock onDone={handleTokenReady} /></div>
  }

  if (appState === 'loading') {
    return (
      <div style={{ ...shellStyle, alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <span className="animate-breathe" style={{
          width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
        }} />
        <p style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
          Connecting to GitHub&hellip;
        </p>
      </div>
    )
  }

  if (appState === 'error') {
    return (
      <div className="animate-fade-up" style={{
        ...shellStyle, alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '20px',
      }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--mood-awful)' }}>
          Failed to connect
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
          {errorMsg}
        </p>
        <button
          onClick={handleRetry}
          style={{
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            padding: '9px 24px', fontSize: '0.8rem', fontWeight: 500,
            fontFamily: 'var(--font)', cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={shellStyle}>
      <Header
        view={view}
        onViewChange={setView}
        syncStatus={syncStatus}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {view === 'today' ? (
        <MoodPicker moods={moods} onSetMood={setMood} />
      ) : (
        <YearInPixels moods={moods} />
      )}
    </div>
  )
}
