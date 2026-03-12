import { MOODS, MOOD_LEVELS } from '../constants'
import type { MoodLevel, MoodRecord } from '../types'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface MoodPickerProps {
  moods: MoodRecord
  onSetMood: (date: string, level: MoodLevel | null) => void
}

export default function MoodPicker({ moods, onSetMood }: MoodPickerProps) {
  const today = new Date()
  const dateStr = toDateStr(today)
  const currentMood = moods[dateStr] as MoodLevel | undefined

  return (
    <div className="animate-fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '40px 20px',
      gap: '36px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.02em',
        }}>
          {formatDate(today)}
        </p>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginTop: '8px',
          letterSpacing: '-0.02em',
        }}>
          How are you feeling?
        </h2>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {MOOD_LEVELS.map((level, i) => {
          const mood = MOODS[level]
          const isSelected = currentMood === level
          return (
            <button
              key={level}
              onClick={() => onSetMood(dateStr, isSelected ? null : level)}
              className={`animate-fade-up delay-${i + 1}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 10px',
                minWidth: '62px',
                borderRadius: 'var(--radius-md)',
                border: isSelected
                  ? `1.5px solid ${mood.color}`
                  : '1.5px solid transparent',
                background: isSelected
                  ? `${mood.color}18`
                  : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                fontFamily: 'var(--font)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'var(--bg-elevated)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'var(--bg-surface)'
                }
              }}
            >
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                {mood.emoji}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isSelected ? 500 : 400,
                color: isSelected ? mood.color : 'var(--text-secondary)',
                transition: 'color 0.2s ease',
              }}>
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>

      {currentMood && (
        <p className="animate-fade-in" style={{
          fontSize: '0.8rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
        }}>
          Feeling {MOODS[currentMood].label.toLowerCase()} today {MOODS[currentMood].emoji}
        </p>
      )}
    </div>
  )
}
