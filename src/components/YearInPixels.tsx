import { useMemo, useState } from 'react'
import DayCell from './DayCell'
import { MONTHS, MOODS } from '../constants'
import type { MoodLevel, MoodRecord } from '../types'

interface DayEntry {
  date: string
  mood: MoodLevel | null
  isToday: boolean
  isFuture: boolean
}

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

interface YearInPixelsProps {
  moods: MoodRecord
}

export default function YearInPixels({ moods }: YearInPixelsProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const today = toDateStr(new Date())
  const currentYear = new Date().getFullYear()

  const grid = useMemo(() => {
    const months: DayEntry[][] = []
    for (let m = 0; m < 12; m++) {
      const days = getDaysInMonth(selectedYear, m)
      const monthDays: DayEntry[] = []
      for (let d = 1; d <= days; d++) {
        const dateStr = `${selectedYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        monthDays.push({
          date: dateStr,
          mood: (moods[dateStr] as MoodLevel) || null,
          isToday: dateStr === today,
          isFuture: dateStr > today,
        })
      }
      months.push(monthDays)
    }
    return months
  }, [moods, selectedYear, today])

  const yearEntries = Object.entries(moods).filter(([d]) =>
    d.startsWith(String(selectedYear))
  )
  const totalLogged = yearEntries.length
  const avgMood =
    totalLogged > 0
      ? (yearEntries.reduce((sum, [, v]) => sum + v, 0) / totalLogged).toFixed(1)
      : null

  const canGoForward = selectedYear < currentYear

  return (
    <div className="animate-fade-up" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      padding: '16px 20px',
      gap: '16px',
      overflowY: 'auto',
    }}>
      {/* Year nav + stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer',
              padding: '2px 4px', fontSize: '0.85rem',
              fontFamily: 'var(--font)',
            }}
          >
            ←
          </button>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}>
            {selectedYear}
          </span>
          <button
            onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
            disabled={!canGoForward}
            style={{
              background: 'none', border: 'none',
              color: canGoForward ? 'var(--text-secondary)' : 'var(--text-tertiary)',
              cursor: canGoForward ? 'pointer' : 'default',
              padding: '2px 4px', fontSize: '0.85rem',
              fontFamily: 'var(--font)', opacity: canGoForward ? 1 : 0.3,
            }}
          >
            →
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '0.7rem',
          fontWeight: 400,
          color: 'var(--text-tertiary)',
        }}>
          <span>{totalLogged} days</span>
          {avgMood && <span style={{ color: 'var(--accent)' }}>avg {avgMood}</span>}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '5px 10px',
        alignItems: 'center',
      }}>
        {grid.map((monthDays, monthIdx) => (
          <div key={monthIdx} style={{ display: 'contents' }}>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textAlign: 'right',
              width: '24px',
            }}>
              {MONTHS[monthIdx]}
            </span>
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              {monthDays.map((day) => (
                <DayCell
                  key={day.date}
                  date={day.date}
                  mood={day.mood}
                  isToday={day.isToday}
                  isFuture={day.isFuture}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        justifyContent: 'center',
        paddingTop: '4px',
      }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>
          Awful
        </span>
        {([1, 2, 3, 4, 5] as const).map((level) => (
          <div
            key={level}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: MOODS[level].color,
            }}
          />
        ))}
        <span style={{ fontSize: '0.55rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>
          Great
        </span>
      </div>
    </div>
  )
}
