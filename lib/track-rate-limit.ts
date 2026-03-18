import { NextRequest } from 'next/server'

interface RateEntry { count: number; resetAt: number }
const store = new Map<string, RateEntry>()

export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/** Returns true if the request is within rate limit, false if exceeded */
export function checkRateLimit(ip: string, limit = 100, windowMs = 3_600_000): boolean {
  const now = Date.now()
  const entry = store.get(ip)
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

/** Parse device type from UA server-side as fallback */
export function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
    if (/ipad/i.test(ua)) return 'tablet'
    return 'mobile'
  }
  return 'desktop'
}

export function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge'
  if (/chrome\//i.test(ua)) return 'Chrome'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/safari\//i.test(ua)) return 'Safari'
  if (/opera\//i.test(ua)) return 'Opera'
  return 'Other'
}

/** Lightweight IP → geo lookup with 2s timeout, fails silently */
export async function getGeo(ip: string): Promise<{ country?: string; region?: string; city?: string }> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('::')) return {}
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return {}
    const data = await res.json()
    return {
      country: data.country_name ?? undefined,
      region: data.region ?? undefined,
      city: data.city ?? undefined,
    }
  } catch {
    return {}
  }
}
