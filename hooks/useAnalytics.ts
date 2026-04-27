import { createClient } from '@supabase/supabase-js'

// Direct Supabase client — eliminates /api/analytics serverless invocations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getSessionId(): string {
  try {
    const key = 'ffnm_session_id'
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/edg\//i.test(ua)) return 'Edge'
  if (/chrome\//i.test(ua)) return 'Chrome'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/safari\//i.test(ua)) return 'Safari'
  if (/opera\//i.test(ua)) return 'Opera'
  return 'Other'
}

interface EventData {
  page?: string
  referrer?: string
  search_query?: string
  listing_id?: string | number
  scroll_depth?: number
  active_time?: number
  total_time?: number
  section?: string
  article_slug?: string
  lead_type?: string
}

export function trackEvent(eventType: string, data: EventData = {}): void {
  try {
    const session_id = getSessionId()
    // Direct Supabase write — zero serverless invocations
    supabase.from('analytics_events').insert({
      event_type: eventType,
      session_id,
      page: data.page ?? null,
      referrer: data.referrer ?? null,
      search_query: data.search_query ?? null,
      listing_id: data.listing_id != null ? String(data.listing_id) : null,
      scroll_depth: data.scroll_depth != null ? Number(data.scroll_depth) : null,
      active_time: data.active_time != null ? Number(data.active_time) : null,
      total_time: data.total_time != null ? Number(data.total_time) : null,
      section: data.section ?? null,
      article_slug: data.article_slug ?? null,
      lead_type: data.lead_type ?? null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      device_type: getDeviceType(),
      browser: getBrowser(),
      // country/city omitted — requires server-side IP geo lookup
    }).then(() => {}, () => {})
  } catch {
    // fail silently
  }
}

export function trackPageView(): void {
  try {
    const page = window.location.pathname + window.location.search
    const referrer = document.referrer || undefined
    trackEvent('page_view', { page, referrer })
  } catch {
    // fail silently
  }
}

export function trackEngagement(
  page: string,
  scrollDepth: number,
  activeTime: number,
  totalTime: number
): void {
  try {
    trackEvent('engagement', { page, scroll_depth: scrollDepth, active_time: activeTime, total_time: totalTime })
  } catch {
    // fail silently
  }
}

export function trackImpression(section: string, page: string): void {
  try {
    trackEvent('impression', { section, page })
  } catch {
    // fail silently
  }
}

export function trackLeadAction(leadType: string, listingId: string | number | null): void {
  try {
    trackEvent('lead_action', {
      lead_type: leadType,
      ...(listingId != null ? { listing_id: String(listingId) } : {}),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
  } catch {
    // fail silently
  }
}

export function trackArticleRead(articleSlug: string, scrollDepth: number): void {
  try {
    trackEvent('article_read', {
      article_slug: articleSlug,
      scroll_depth: scrollDepth,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
  } catch {
    // fail silently
  }
}
