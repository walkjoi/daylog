import { OAUTH_CLIENT_ID, OAUTH_WORKER_URL } from '../constants'

interface DeviceCodeResponse {
  deviceCode: string
  userCode: string
  verificationUri: string
  expiresIn: number
  interval: number
}

async function post(path: string, body: Record<string, string>): Promise<Record<string, string>> {
  const res = await fetch(`${OAUTH_WORKER_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`OAuth proxy error: ${res.status}`)
  return res.json()
}

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const data = await post('/login/device/code', {
    client_id: OAUTH_CLIENT_ID,
    scope: 'gist',
  })

  if (data.error) throw new Error(data.error_description || data.error)

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri,
    expiresIn: Number(data.expires_in),
    interval: Number(data.interval) || 5,
  }
}

export async function pollForToken(
  deviceCode: string,
  interval = 5,
  signal?: AbortSignal
): Promise<string> {
  let pollInterval = interval * 1000

  while (true) {
    if (signal?.aborted) throw new Error('Cancelled')

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, pollInterval)
      signal?.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new Error('Cancelled'))
      }, { once: true })
    })

    const data = await post('/login/oauth/access_token', {
      client_id: OAUTH_CLIENT_ID,
      device_code: deviceCode,
    })

    if (data.access_token) {
      return data.access_token
    }

    if (data.error === 'authorization_pending') continue

    if (data.error === 'slow_down') {
      pollInterval += 5000
      continue
    }

    if (data.error === 'expired_token') {
      throw new Error('Code expired. Please try again.')
    }

    if (data.error === 'access_denied') {
      throw new Error('Authorization denied by user.')
    }

    if (data.error) {
      throw new Error(data.error_description || data.error)
    }
  }
}

export function isOAuthAvailable(): boolean {
  return !!(OAUTH_CLIENT_ID && OAUTH_WORKER_URL)
}
