import { MOODS } from '../constants'
import type { MoodLevel } from '../types'

interface DayCellProps {
  date: string
  mood: MoodLevel | null
  isToday: boolean
  isFuture: boolean
}

export default function DayCell({ date, mood, isToday, isFuture }: DayCellProps) {
  const moodData = mood ? MOODS[mood] : null

  return (
    <div
      title={isFuture ? '' : `${date}${moodData ? ` — ${moodData.label}` : ''}`}
      style={{
        width: 13,
        height: 13,
        borderRadius: 3,
        backgroundColor: isFuture
          ? 'rgba(255,255,255,0.02)'
          : moodData
          ? moodData.color
          : 'rgba(255,255,255,0.05)',
        outline: isToday ? '1.5px solid var(--accent)' : 'none',
        outlineOffset: 1,
        transition: 'transform 0.15s ease',
        opacity: isFuture ? 0.3 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isFuture && moodData) {
          e.currentTarget.style.transform = 'scale(1.5)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isFuture && moodData) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    />
  )
}
