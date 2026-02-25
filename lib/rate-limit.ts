// In-memory rate limiter: max 5 requests per IP per hour
// Stored as a Map<ip, timestamp[]> — entries older than 1 hour are pruned on each check.

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5

const ipTimestamps = new Map<string, number[]>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  // Get existing timestamps for this IP and drop anything outside the window
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(t => t > windowStart)

  if (timestamps.length >= MAX_REQUESTS) {
    ipTimestamps.set(ip, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  ipTimestamps.set(ip, timestamps)
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length }
}

export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
