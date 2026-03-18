import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') ?? '30')
    const since = new Date(Date.now() - days * 86_400_000).toISOString()

    const [
      // A: Traffic overview — session + visitor counts
      { data: sessionCounts },
      // B: Daily sessions for chart
      { data: dailySessions },
      // C: Top pages
      { data: topPages },
      // D: User journeys — top entry pages
      { data: journeySteps },
      // E: Search analytics
      { data: topSearches },
      // F: Listing interactions by type
      { data: interactionTypes },
      // G: Top listings by views
      { data: topListings },
      // H: Traffic sources (referrers)
      { data: topReferrers },
      // I: Device breakdown
      { data: deviceBreakdown },
      // J: Country breakdown
      { data: countryBreakdown },
      // K: Top outbound clicks
      { data: outboundClicks },
      // L: Bounce rate + avg duration
      { data: sessionMeta },
      // M: Real-time (last 30 min sessions)
      { data: realtimeSessions },
    ] = await Promise.all([
      supabase
        .from('sessions')
        .select('id, visitor_id, started_at, country')
        .gte('started_at', since),

      supabase
        .rpc('analytics_daily_sessions', { p_since: since })
        .select('*'),

      supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', since),

      supabase
        .from('user_journeys')
        .select('page_path, step_number')
        .eq('step_number', 1)
        .gte('created_at', since),

      supabase
        .from('search_queries')
        .select('query, results_count')
        .gte('created_at', since),

      supabase
        .from('listing_interactions')
        .select('interaction_type')
        .gte('created_at', since),

      supabase
        .from('listing_interactions')
        .select('listing_name, listing_id, interaction_type')
        .gte('created_at', since),

      supabase
        .from('page_views')
        .select('referrer')
        .not('referrer', 'is', null)
        .neq('referrer', '')
        .gte('created_at', since),

      supabase
        .from('page_views')
        .select('device_type')
        .gte('created_at', since),

      supabase
        .from('sessions')
        .select('country')
        .not('country', 'is', null)
        .gte('started_at', since),

      supabase
        .from('outbound_clicks')
        .select('destination_url, link_type, listing_id')
        .gte('created_at', since),

      supabase
        .from('sessions')
        .select('duration_seconds, page_count')
        .gte('started_at', since),

      supabase
        .from('sessions')
        .select('id, visitor_id, country, entry_page, started_at')
        .gte('started_at', new Date(Date.now() - 30 * 60_000).toISOString()),
    ])

    // --- Process traffic overview ---
    const totalSessions = sessionCounts?.length ?? 0
    const uniqueVisitors = new Set(sessionCounts?.map(s => s.visitor_id)).size
    const newVisitors = sessionCounts?.filter(s => {
      // approximate: if only 1 session for this visitor in window = new
      const vid = s.visitor_id
      return sessionCounts.filter(x => x.visitor_id === vid).length === 1
    }).length ?? 0

    // --- Daily sessions chart ---
    // group page_views by date if RPC not available
    const dailyMap: Record<string, number> = {}
    if (!dailySessions) {
      for (const s of sessionCounts ?? []) {
        const d = s.started_at?.slice(0, 10)
        if (d) dailyMap[d] = (dailyMap[d] ?? 0) + 1
      }
    }
    const dailyChart = dailySessions
      ? dailySessions
      : Object.entries(dailyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, sessions]) => ({ date, sessions }))

    // --- Top pages ---
    const pageMap: Record<string, number> = {}
    for (const pv of topPages ?? []) {
      pageMap[pv.page_path] = (pageMap[pv.page_path] ?? 0) + 1
    }
    const topPagesArr = Object.entries(pageMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([page, views]) => ({ page, views }))

    // --- Top entry pages ---
    const entryMap: Record<string, number> = {}
    for (const j of journeySteps ?? []) {
      entryMap[j.page_path] = (entryMap[j.page_path] ?? 0) + 1
    }
    const topEntries = Object.entries(entryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    // --- Top searches ---
    const searchMap: Record<string, number> = {}
    for (const sq of topSearches ?? []) {
      if (sq.query) searchMap[sq.query] = (searchMap[sq.query] ?? 0) + 1
    }
    const topSearchArr = Object.entries(searchMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }))

    // --- Interaction type breakdown ---
    const interMap: Record<string, number> = {}
    for (const i of interactionTypes ?? []) {
      if (i.interaction_type) interMap[i.interaction_type] = (interMap[i.interaction_type] ?? 0) + 1
    }
    const interArr = Object.entries(interMap)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }))

    // --- Top listings by interactions ---
    const listingMap: Record<string, { name: string; views: number; clicks: number }> = {}
    for (const li of topListings ?? []) {
      const key = li.listing_id ?? li.listing_name ?? 'unknown'
      if (!listingMap[key]) listingMap[key] = { name: li.listing_name ?? key, views: 0, clicks: 0 }
      if (li.interaction_type === 'listing_view') listingMap[key].views++
      else listingMap[key].clicks++
    }
    const topListingsArr = Object.values(listingMap)
      .sort((a, b) => (b.views + b.clicks) - (a.views + a.clicks))
      .slice(0, 20)

    // --- Traffic sources ---
    const refMap: Record<string, number> = {}
    for (const pv of topReferrers ?? []) {
      if (!pv.referrer) continue
      try {
        const host = new URL(pv.referrer).hostname.replace('www.', '')
        refMap[host] = (refMap[host] ?? 0) + 1
      } catch { refMap[pv.referrer.slice(0, 50)] = (refMap[pv.referrer.slice(0, 50)] ?? 0) + 1 }
    }
    const topRefArr = Object.entries(refMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }))

    // --- Device breakdown ---
    const devMap: Record<string, number> = {}
    for (const pv of deviceBreakdown ?? []) {
      const d = pv.device_type ?? 'unknown'
      devMap[d] = (devMap[d] ?? 0) + 1
    }

    // --- Country breakdown ---
    const countryMap: Record<string, number> = {}
    for (const s of countryBreakdown ?? []) {
      const c = s.country ?? 'Unknown'
      countryMap[c] = (countryMap[c] ?? 0) + 1
    }
    const topCountries = Object.entries(countryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }))

    // --- Top outbound clicks ---
    const outMap: Record<string, { url: string; type: string; count: number }> = {}
    for (const oc of outboundClicks ?? []) {
      const key = oc.destination_url ?? 'unknown'
      if (!outMap[key]) outMap[key] = { url: key, type: oc.link_type ?? 'unknown', count: 0 }
      outMap[key].count++
    }
    const topOutbound = Object.values(outMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    // --- Session meta (bounce rate, avg duration) ---
    const validDurations = (sessionMeta ?? []).filter(s => s.duration_seconds != null)
    const avgDuration = validDurations.length
      ? Math.round(validDurations.reduce((sum, s) => sum + s.duration_seconds, 0) / validDurations.length)
      : 0
    const avgPageCount = sessionMeta?.length
      ? (sessionMeta.reduce((sum, s) => sum + (s.page_count ?? 1), 0) / sessionMeta.length).toFixed(1)
      : '0'

    return NextResponse.json({
      overview: { totalSessions, uniqueVisitors, newVisitors, avgDuration, avgPageCount },
      dailyChart,
      topPages: topPagesArr,
      topEntries,
      topSearches: topSearchArr,
      interactionTypes: interArr,
      topListings: topListingsArr,
      topReferrers: topRefArr,
      deviceBreakdown: devMap,
      topCountries,
      topOutbound,
      realtimeSessions: realtimeSessions?.length ?? 0,
    })
  } catch (err) {
    console.error('analytics-fp error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
