/**
 * Cloudflare Worker — GitHub OAuth Device Flow Proxy
 *
 * Why this exists:
 *   GitHub's device flow endpoints don't support CORS,
 *   so browsers can't call them directly. This worker
 *   proxies two endpoints and adds CORS headers.
 *
 * Deploy:
 *   npx wrangler deploy
 *
 * Endpoints:
 *   POST /login/device/code   → github.com/login/device/code
 *   POST /login/oauth/access_token → github.com/login/oauth/access_token
 */

const GITHUB = 'https://github.com'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function corsResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

async function proxyToGitHub(path: string, body: Record<string, string>): Promise<Response> {
  const res = await fetch(`${GITHUB}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return corsResponse(data as Record<string, unknown>, res.status)
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405)
    }

    const url = new URL(request.url)
    const body = await request.json().catch(() => ({})) as Record<string, string>

    switch (url.pathname) {
      case '/login/device/code':
        return proxyToGitHub('/login/device/code', {
          client_id: body.client_id,
          scope: body.scope || 'gist',
        })

      case '/login/oauth/access_token':
        return proxyToGitHub('/login/oauth/access_token', {
          client_id: body.client_id,
          device_code: body.device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        })

      default:
        return corsResponse({ error: 'Not found' }, 404)
    }
  },
}
