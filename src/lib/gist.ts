import { GIST_FILENAME, GIST_CONFIG_KEY } from '../constants'
import { encrypt, decrypt } from './crypto'
import { getMoods } from './storage'
import type { GistConfig, MoodRecord } from '../types'

function readConfig(): GistConfig | null {
  try {
    const raw = localStorage.getItem(GIST_CONFIG_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeConfig(config: GistConfig): void {
  localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(config))
}

// ── Token queries ─────────────────────────────────────────────────

export function hasEncryptedToken(): boolean {
  return !!readConfig()?.encrypted
}

export async function saveEncryptedToken(token: string, password: string): Promise<void> {
  const config: GistConfig = readConfig() || {}
  config.encrypted = await encrypt(token, password)
  writeConfig(config)
}

export async function unlockToken(password: string): Promise<string> {
  const config = readConfig()
  if (!config?.encrypted) throw new Error('No encrypted token found')
  return decrypt(config.encrypted, password)
}

// ── Gist ID queries ───────────────────────────────────────────────

export function getGistId(): string | null {
  return readConfig()?.gistId || null
}

export function saveGistId(gistId: string | null): void {
  const config: GistConfig = readConfig() || {}
  config.gistId = gistId
  writeConfig(config)
}

// ── Wipe everything ───────────────────────────────────────────────

export function clearAllConfig(): void {
  localStorage.removeItem(GIST_CONFIG_KEY)
}

// ── GitHub API ────────────────────────────────────────────────────

const GITHUB_API = 'https://api.github.com'

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

export async function validateToken(token: string): Promise<string> {
  const res = await fetch(`${GITHUB_API}/user`, { headers: headers(token) })
  if (!res.ok) throw new Error(`Invalid token (${res.status})`)
  const data = await res.json()
  return data.login as string
}

export async function fetchGist(gistId: string, token: string): Promise<MoodRecord> {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`Failed to fetch gist: ${res.status}`)
  const data = await res.json()
  const file = data.files[GIST_FILENAME]
  if (!file) return {}
  return JSON.parse(file.content) as MoodRecord
}

export async function updateGist(gistId: string, token: string, moods: MoodRecord): Promise<void> {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(moods, null, 2) },
      },
    }),
  })
  if (!res.ok) throw new Error(`Failed to update gist: ${res.status}`)
}

export async function createGist(token: string, moods: MoodRecord = {}): Promise<string> {
  const res = await fetch(`${GITHUB_API}/gists`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      description: 'Daylog mood data',
      public: false,
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(moods, null, 2) },
      },
    }),
  })
  if (!res.ok) throw new Error(`Failed to create gist: ${res.status}`)
  const data = await res.json()
  return data.id as string
}

export async function findExistingGist(token: string): Promise<string | null> {
  const res = await fetch(`${GITHUB_API}/gists?per_page=100`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`Failed to list gists: ${res.status}`)
  const gists = await res.json()

  for (const gist of gists) {
    if (gist.files[GIST_FILENAME]) {
      return gist.id as string
    }
  }
  return null
}

export async function verifyGist(gistId: string, token: string): Promise<boolean> {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: headers(token),
  })
  return res.ok
}

export async function resolveGist(token: string): Promise<string> {
  const savedId = getGistId()
  if (savedId) {
    const valid = await verifyGist(savedId, token)
    if (valid) return savedId
    saveGistId(null)
  }

  const found = await findExistingGist(token)
  if (found) {
    saveGistId(found)
    return found
  }

  const moods = getMoods()
  const newId = await createGist(token, moods)
  saveGistId(newId)
  return newId
}
