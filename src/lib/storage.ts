import { STORAGE_KEY } from '../constants'
import type { MoodLevel, MoodRecord } from '../types'

export { STORAGE_KEY }

export function getMoods(): MoodRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setMood(date: string, level: MoodLevel | null): MoodRecord {
  const moods = getMoods()
  if (level === null) {
    delete moods[date]
  } else {
    moods[date] = level
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moods))
  return moods
}

export function getAllMoods(): MoodRecord {
  return getMoods()
}

export function mergeMoods(local: MoodRecord, remote: MoodRecord): MoodRecord {
  return { ...local, ...remote }
}
