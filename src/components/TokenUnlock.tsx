import { useState } from 'react'
import { unlockToken, clearAllConfig } from '../lib/gist'

interface TokenUnlockProps {
  onDone: (token: string) => void
}

export default function TokenUnlock({ onDone }: TokenUnlockProps) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUnlock = async () => {
    if (!password) return setStatus('Enter your password')
    setLoading(true)
    setStatus('Decrypting\u2026')
    try {
      const token = await unlockToken(password)
      onDone(token)
    } catch {
      setStatus('Wrong password. Try again.')
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('This will remove your encrypted token. You\u2019ll need to set up again.')) {
      clearAllConfig()
      window.location.reload()
    }
  }

  return (
    <div className="animate-fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            daylog
          </h1>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            marginTop: '6px',
          }}>
            Enter your password to unlock.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="Your password"
            autoFocus
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          />

          <button
            onClick={handleUnlock}
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 20px',
              fontSize: '0.8rem',
              fontWeight: 500,
              fontFamily: 'var(--font)',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
          >
            {loading ? 'Decrypting\u2026' : 'Unlock'}
          </button>
        </div>

        {status && (
          <p className="animate-fade-in" style={{
            fontSize: '0.7rem',
            fontWeight: 400,
            color: status.includes('Wrong') ? 'var(--mood-awful)' : 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            {status}
          </p>
        )}

        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.65rem',
            fontWeight: 400,
            fontFamily: 'var(--font)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--mood-awful)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          Forgot password? Reset
        </button>
      </div>
    </div>
  )
}
