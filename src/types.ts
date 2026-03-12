export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodInfo {
  label: string
  emoji: string
  color: string
}

export type MoodRecord = Record<string, MoodLevel>

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export type AppState = 'setup' | 'unlock' | 'loading' | 'ready' | 'error'

export interface EncryptedPayload {
  salt: string
  iv: string
  ciphertext: string
}

export interface GistConfig {
  encrypted?: EncryptedPayload
  gistId?: string | null
}
