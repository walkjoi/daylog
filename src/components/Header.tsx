import type { SyncStatus } from '../types'

type ViewTab = 'today' | 'year'
type Theme = 'light' | 'dark'

interface HeaderProps {
  view: ViewTab
  onViewChange: (tab: ViewTab) => void
  syncStatus: SyncStatus
  theme: Theme
  onToggleTheme: () => void
}

const syncColors: Record<SyncStatus, string> = {
  syncing: 'var(--accent)',
  synced: 'var(--mood-great)',
  error: 'var(--mood-awful)',
  idle: 'var(--border)',
}

export default function Header({ view, onViewChange, syncStatus, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="animate-fade-up" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        daylog
      </span>

      <nav style={{
        display: 'flex',
        gap: '2px',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-sm)',
        padding: '3px',
      }}>
        {(['today', 'year'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onViewChange(tab)}
            style={{
              padding: '5px 14px',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
              background: view === tab ? 'var(--accent)' : 'transparent',
              color: view === tab ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'var(--font)',
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className={syncStatus === 'syncing' ? 'animate-breathe' : ''}
          title={syncStatus}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: syncColors[syncStatus],
            transition: 'background 0.3s ease',
          }}
        />
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.85rem',
            lineHeight: 1,
            color: 'var(--text-secondary)',
            transition: 'color 0.2s ease',
          }}
        >
          {theme === 'light' ? '◐' : '◑'}
        </button>
      </div>
    </header>
  )
}
