import { useState, useCallback, useRef } from 'react'
import { getMoods, setMood as storeMood, mergeMoods, STORAGE_KEY } from '../lib/storage'
import { fetchGist, updateGist, resolveGist } from '../lib/gist'
import type { MoodLevel, MoodRecord, SyncStatus } from '../types'

interface Session {
  token: string
  gistId: string
}

export function useMoodData() {
  const [moods, setMoods] = useState<MoodRecord>(() => getMoods())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')

  const sessionRef = useRef<Session | null>(null)

  const setSession = useCallback((token: string, gistId: string) => {
    sessionRef.current = { token, gistId }
  }, [])

  const ensureValidGist = useCallback(async (): Promise<Session | null> => {
    const session = sessionRef.current
    if (!session) return null

    try {
      await fetchGist(session.gistId, session.token)
      return session
    } catch {
      const newId = await resolveGist(session.token)
      session.gistId = newId
      return session
    }
  }, [])

  const setMood = useCallback((date: string, level: MoodLevel | null) => {
    const updated = storeMood(date, level)
    setMoods({ ...updated })

    const session = sessionRef.current
    if (session) {
      setSyncStatus('syncing')
      updateGist(session.gistId, session.token, updated)
        .then(() => setSyncStatus('synced'))
        .catch(async () => {
          try {
            const resolved = await ensureValidGist()
            if (resolved) {
              await updateGist(resolved.gistId, resolved.token, updated)
              setSyncStatus('synced')
              return
            }
          } catch { /* fall through */ }
          setSyncStatus('error')
        })
    }
  }, [ensureValidGist])

  const syncFromGist = useCallback(async () => {
    const session = sessionRef.current
    if (!session) return

    setSyncStatus('syncing')
    try {
      const remote = await fetchGist(session.gistId, session.token)
      const local = getMoods()
      const merged = mergeMoods(local, remote)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      setMoods({ ...merged })

      await updateGist(session.gistId, session.token, merged)
      setSyncStatus('synced')
    } catch {
      setSyncStatus('error')
    }
  }, [])

  return { moods, setMood, syncStatus, setSession, syncFromGist }
}
