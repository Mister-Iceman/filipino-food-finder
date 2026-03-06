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
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, session_id, ...data }),
      keepalive: true,
    }).catch(() => {})
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
