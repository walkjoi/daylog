import { useState, type CSSProperties } from 'react'
import { validateToken, saveEncryptedToken } from '../lib/gist'

const inputStyle: CSSProperties = {
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
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '5px',
}

interface TokenSetupProps {
  onDone: (token: string) => void
}

export default function TokenSetup({ onDone }: TokenSetupProps) {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const trimmed = token.trim()
    if (!trimmed) return setStatus('Paste your GitHub token')
    if (!password) return setStatus('Choose a password')
    if (password.length < 4) return setStatus('Password too short (min 4 chars)')
    if (password !== confirm) return setStatus('Passwords don\u2019t match')

    setLoading(true)
    setStatus('Validating token\u2026')
    try {
      const username = await validateToken(trimmed)
      setStatus(`Authenticated as ${username}. Encrypting\u2026`)
      await saveEncryptedToken(trimmed, password)
      onDone(trimmed)
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`)
    } finally {
      setLoading(false)
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
            lineHeight: 1.5,
          }}>
            Connect your GitHub to sync moods across devices.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>GitHub Personal Access Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              style={inputStyle}
            />
            <p style={{
              fontSize: '0.65rem',
              fontWeight: 400,
              color: 'var(--text-tertiary)',
              marginTop: '4px',
            }}>
              Needs <code style={{
                background: 'var(--bg-elevated)',
                padding: '1px 4px',
                borderRadius: 3,
                fontSize: '0.6rem',
              }}>gist</code> scope.{' '}
              <a
                href="https://github.com/settings/tokens/new?scopes=gist&description=Daylog"
                target="_blank"
                rel="noopener"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                Create one →
              </a>
            </p>
          </div>

          <div>
            <label style={labelStyle}>Encryption Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Confirm password"
              style={inputStyle}
            />
            <p style={{
              fontSize: '0.6rem',
              color: 'var(--text-tertiary)',
              marginTop: '4px',
            }}>
              You'll need this each session to unlock sync.
            </p>
          </div>

          <button
            onClick={handleSubmit}
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
              marginTop: '2px',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
          >
            {loading ? 'Setting up\u2026' : 'Continue'}
          </button>
        </div>

        {status && (
          <p className="animate-fade-in" style={{
            fontSize: '0.7rem',
            fontWeight: 400,
            color: status.startsWith('Error') ? 'var(--mood-awful)' : 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
