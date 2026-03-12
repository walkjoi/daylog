import type { MoodLevel, MoodInfo } from './types'

export const MOODS: Record<MoodLevel, MoodInfo> = {
  5: { label: 'Great',  emoji: '😊', color: '#6ee7a0' },
  4: { label: 'Good',   emoji: '🙂', color: '#a3e05c' },
  3: { label: 'Meh',    emoji: '😐', color: '#fbbf40' },
  2: { label: 'Bad',    emoji: '😔', color: '#f08c5a' },
  1: { label: 'Awful',  emoji: '😞', color: '#f06868' },
}

export const MOOD_LEVELS: MoodLevel[] = [5, 4, 3, 2, 1]

export const STORAGE_KEY = 'daylog_moods'
export const GIST_CONFIG_KEY = 'daylog_gist_config'
export const GIST_FILENAME = 'daylog-moods.json'

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

// ── OAuth config ──────────────────────────────────────────────────
export const OAUTH_CLIENT_ID = ''
export const OAUTH_WORKER_URL = ''
