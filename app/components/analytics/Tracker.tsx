'use client'

import {
  createContext, useContext, useEffect, useRef, useCallback, ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackerContextValue {
  sessionId: string
  visitorId: string
  trackInteraction: (params: InteractionParams) => void
  trackSearch: (params: SearchParams) => void
  trackOutbound: (params: OutboundParams) => void
}

interface InteractionParams {
  interaction_type: string
  listing_id?: string | number
  listing_name?: string
  listing_category?: string
  listing_city?: string
  metadata?: Record<string, unknown>
}

interface SearchParams {
  query: string
  results_count?: number
  clicked_result_id?: string
  clicked_result_name?: string
  filters_used?: Record<string, unknown>
}

interface OutboundParams {
  destination_url: string
  link_type?: string
  source_page?: string
  listing_id?: string | number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreate(storage: Storage, key: string, factory: () => string): string {
  let val = storage.getItem(key)
  if (!val) {
    val = factory()
    storage.setItem(key, val)
  }
  return val
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function beacon(url: string, data: object) {
  try {
    navigator.sendBeacon(url, JSON.stringify(data))
  } catch {
    // silently ignore
  }
}

function post(url: string, data: object) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {})
}

function getUTMParams(): Record<string, string | null> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
  }
}

function getDeviceType(): string {
  const ua = navigator.userAgent
  if (/ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getBrowser(): string {
  const ua = navigator.userAgent
  if (/edg\//i.test(ua)) return 'Edge'
  if (/chrome\//i.test(ua)) return 'Chrome'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/safari\//i.test(ua)) return 'Safari'
  if (/opera\//i.test(ua)) return 'Opera'
  return 'Other'
}

function getOS(): string {
  const ua = navigator.userAgent
  if (/windows/i.test(ua)) return 'Windows'
  if (/macintosh|mac os x/i.test(ua)) return 'macOS'
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/linux/i.test(ua)) return 'Linux'
  return 'Other'
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TrackerContext = createContext<TrackerContextValue | null>(null)

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used inside <FFNMTracker>')
  return ctx
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FFNMTracker({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // IDs initialised lazily on first render (client only)
  const visitorIdRef = useRef<string>('')
  const sessionIdRef = useRef<string>('')
  const sessionStartedRef = useRef(false)

  // Page-level tracking state
  const pageStartRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const pageViewIdRef = useRef<string>('')
  const pagePathRef = useRef<string>('')
  const stepRef = useRef<number>(0)

  // ── Init visitor + session IDs once on mount ──────────────────────────────
  useEffect(() => {
    try {
      visitorIdRef.current = getOrCreate(localStorage, 'ffnm_vid', uuid)
      sessionIdRef.current = getOrCreate(sessionStorage, 'ffnm_sid', uuid)
    } catch {
      visitorIdRef.current = uuid()
      sessionIdRef.current = uuid()
    }

    if (!sessionStartedRef.current) {
      sessionStartedRef.current = true
      const utm = getUTMParams()
      post('/api/track/session', {
        id: sessionIdRef.current,
        visitor_id: visitorIdRef.current,
        action: 'start',
        entry_page: window.location.pathname,
        referrer: document.referrer || null,
        device_type: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        ...utm,
      })
    }

    // End session on tab/window close
    const handleUnload = () => {
      beacon('/api/track/session', {
        id: sessionIdRef.current,
        visitor_id: visitorIdRef.current,
        action: 'end',
        exit_page: pagePathRef.current,
      })
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Scroll depth tracker ──────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const total = el.scrollHeight
      if (total <= 0) return
      const pct = Math.round((scrolled / total) * 100)
      if (pct > maxScrollRef.current) maxScrollRef.current = pct
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Page view tracking (fires on every pathname change) ───────────────────
  useEffect(() => {
    if (!visitorIdRef.current || !sessionIdRef.current) return

    // If this is a page navigation (not first load), send exit beacon for previous page
    if (pagePathRef.current && pagePathRef.current !== pathname) {
      const elapsed = Math.round((Date.now() - pageStartRef.current) / 1000)
      beacon('/api/track/pageview', {
        session_id: sessionIdRef.current,
        visitor_id: visitorIdRef.current,
        page_path: pagePathRef.current,
        action: 'update',
        duration_seconds: elapsed,
        scroll_depth: maxScrollRef.current,
        is_bounce: elapsed < 10 && stepRef.current <= 1,
      })

      // Update session page count / exit page
      beacon('/api/track/session', {
        id: sessionIdRef.current,
        visitor_id: visitorIdRef.current,
        action: 'update',
        exit_page: pathname,
        page_count: stepRef.current + 1,
      })
    }

    // Reset per-page state
    pageStartRef.current = Date.now()
    maxScrollRef.current = 0
    pageViewIdRef.current = uuid()
    pagePathRef.current = pathname
    stepRef.current += 1

    const utm = getUTMParams()

    post('/api/track/pageview', {
      session_id: sessionIdRef.current,
      visitor_id: visitorIdRef.current,
      page_path: pathname,
      page_title: document.title || null,
      referrer: document.referrer || null,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      step_number: stepRef.current,
      ...utm,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── Tracking helpers ──────────────────────────────────────────────────────

  const trackInteraction = useCallback((params: InteractionParams) => {
    post('/api/track/interaction', {
      session_id: sessionIdRef.current,
      visitor_id: visitorIdRef.current,
      ...params,
      listing_id: params.listing_id != null ? String(params.listing_id) : undefined,
    })
  }, [])

  const trackSearch = useCallback((params: SearchParams) => {
    post('/api/track/search', {
      session_id: sessionIdRef.current,
      visitor_id: visitorIdRef.current,
      ...params,
    })
  }, [])

  const trackOutbound = useCallback((params: OutboundParams) => {
    beacon('/api/track/outbound', {
      session_id: sessionIdRef.current,
      visitor_id: visitorIdRef.current,
      ...params,
      listing_id: params.listing_id != null ? String(params.listing_id) : undefined,
    })
  }, [])

  const value: TrackerContextValue = {
    sessionId: sessionIdRef.current,
    visitorId: visitorIdRef.current,
    trackInteraction,
    trackSearch,
    trackOutbound,
  }

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  )
}
