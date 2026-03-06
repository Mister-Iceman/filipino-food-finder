'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

const DISH_NAMES = [
  'adobo', 'lechon', 'sinigang', 'kare-kare', 'pancit', 'lumpia',
  'halo-halo', 'sisig', 'ube', 'balut', 'bibingka', 'pan de sal',
  'dinuguan', 'tapsilog', 'palabok',
]

interface AnalyticsEvent {
  id: string
  event_type: string
  page: string | null
  referrer: string | null
  device_type: string | null
  browser: string | null
  country: string | null
  city: string | null
  search_query: string | null
  listing_id: string | null
  session_id: string | null
  created_at: string
  scroll_depth: number | null
  active_time: number | null
  total_time: number | null
  section: string | null
  article_slug: string | null
  lead_type: string | null
}

type DateRange = '24h' | '7d' | '30d' | '90d' | 'all'

const rangeLabels: Record<DateRange, string> = {
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  all: 'All Time',
}

function dateRangeStart(range: DateRange): Date | null {
  if (range === 'all') return null
  const d = new Date()
  if (range === '24h') d.setHours(d.getHours() - 24)
  else if (range === '7d') d.setDate(d.getDate() - 7)
  else if (range === '30d') d.setDate(d.getDate() - 30)
  else if (range === '90d') d.setDate(d.getDate() - 90)
  return d
}

function countBy<T>(arr: T[], key: (item: T) => string | null | undefined): Record<string, number> {
  const map: Record<string, number> = {}
  for (const item of arr) {
    const k = key(item) ?? 'unknown'
    map[k] = (map[k] ?? 0) + 1
  }
  return map
}

function topN(map: Record<string, number>, n: number): [string, number][] {
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n)
}

function avgGrouped(
  arr: AnalyticsEvent[],
  groupFn: (e: AnalyticsEvent) => string | null,
  valueFn: (e: AnalyticsEvent) => number | null
): [string, number, number][] {
  const groups: Record<string, number[]> = {}
  for (const e of arr) {
    const key = groupFn(e)
    if (!key) continue
    const val = valueFn(e)
    if (val == null) continue
    if (!groups[key]) groups[key] = []
    groups[key].push(val)
  }
  return Object.entries(groups)
    .map(([key, vals]) => [
      key,
      Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
      vals.length,
    ] as [string, number, number])
    .sort((a, b) => b[2] - a[2])
    .slice(0, 10)
}

function getDayBuckets(events: AnalyticsEvent[], days: number) {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dayStr = d.toISOString().slice(0, 10)
    const count = events.filter(e => e.created_at.slice(0, 10) === dayStr).length
    return { label, count }
  })
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function CSSBarChart({ data, color = '#0038A8' }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-1.5">
      {data.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-28 text-right text-gray-500 shrink-0 text-xs truncate">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="w-8 text-gray-700 text-xs font-medium text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}

function TimelineChart({ events, days }: { events: AnalyticsEvent[]; days: number }) {
  const buckets = getDayBuckets(events, days)
  const max = Math.max(...buckets.map(b => b.count), 1)
  return (
    <div className="flex items-end gap-0.5 h-32">
      {buckets.map(({ label, count }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full flex items-end justify-center" style={{ height: '100px' }}>
            <div
              className="w-full rounded-t transition-all bg-[#0038A8] group-hover:bg-[#002a80]"
              style={{ height: `${Math.max((count / max) * 100, count > 0 ? 4 : 0)}%` }}
              title={`${label}: ${count}`}
            />
          </div>
          <span className="text-[9px] text-gray-400 rotate-45 origin-left whitespace-nowrap hidden lg:block">{label}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }: { data: [string, number][] }) {
  const total = data.reduce((s, [, c]) => s + c, 0)
  if (total === 0) return <p className="text-gray-400 text-sm">No data yet.</p>
  const colors = ['#0038A8', '#FCD116', '#CE1126', '#4ade80', '#f97316']
  let angle = 0
  const slices = data.map(([label, count], i) => {
    const pct = count / total
    const start = angle
    angle += pct * 360
    return { label, count, pct, start, color: colors[i % colors.length] }
  })
  const toXY = (a: number, r: number) => {
    const rad = ((a - 90) * Math.PI) / 180
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) }
  }
  const arcPath = (s: number, e: number, r: number) => {
    const sp = toXY(s, r), ep = toXY(e, r)
    return `M 50 50 L ${sp.x} ${sp.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${ep.x} ${ep.y} Z`
  }
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
        {slices.map(s => <path key={s.label} d={arcPath(s.start, s.start + s.pct * 360, 42)} fill={s.color} stroke="white" strokeWidth="1" />)}
        <circle cx="50" cy="50" r="22" fill="white" />
      </svg>
      <div className="space-y-1">
        {slices.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-700">{s.label}</span>
            <span className="text-gray-500">({s.count} · {Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataTable({
  headers,
  rows,
  empty = 'No data yet.',
}: {
  headers: string[]
  rows: (string | number)[][]
  empty?: string
}) {
  if (rows.length === 0) return <p className="text-gray-400 text-sm">{empty}</p>
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          {headers.map(h => <th key={h} className="text-left py-2 text-gray-500 font-medium first:text-left last:text-right">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-gray-50 hover:bg-gray-50">
            {row.map((cell, ci) => (
              <td key={ci} className={`py-2 text-gray-700 ${ci === row.length - 1 ? 'text-right font-medium text-gray-900' : ''}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const EVENT_BADGE_COLORS: Record<string, string> = {
  page_view: 'bg-blue-100 text-blue-700',
  listing_click: 'bg-purple-100 text-purple-700',
  search: 'bg-yellow-100 text-yellow-700',
  engagement: 'bg-green-100 text-green-700',
  impression: 'bg-gray-100 text-gray-600',
  lead_action: 'bg-red-100 text-red-700',
  article_read: 'bg-orange-100 text-orange-700',
  add_business_start: 'bg-teal-100 text-teal-700',
  add_business_complete: 'bg-teal-100 text-teal-700',
}

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [liveEvents, setLiveEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const start = dateRangeStart(dateRange)
      let q = supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50000)
      if (start) q = q.gte('created_at', start.toISOString())
      const { data } = await q
      setEvents(data ?? [])
    } catch { /* fail silently */ }
    setLoading(false)
  }, [dateRange])

  const loadLiveEvents = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setLiveEvents(data ?? [])
    } catch { /* fail silently */ }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    loadEvents()
    loadLiveEvents()
  }, [isAuthenticated, loadEvents])

  // Auto-refresh live feed every 30s
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(loadLiveEvents, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, loadLiveEvents])

  const exportCSV = () => {
    const headers = ['event_type','page','section','referrer','device_type','browser','country','city','search_query','listing_id','article_slug','lead_type','scroll_depth','active_time','total_time','session_id','created_at']
    const rows = events.map(e =>
      headers.map(h => {
        const val = (e as Record<string, unknown>)[h]
        if (val == null) return ''
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ffnm-analytics-${dateRange}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    window.print()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ——— Derived data ———
  const pageViews = events.filter(e => e.event_type === 'page_view')
  const listingClicks = events.filter(e => e.event_type === 'listing_click')
  const searches = events.filter(e => e.event_type === 'search')
  const engagements = events.filter(e => e.event_type === 'engagement')
  const impressions = events.filter(e => e.event_type === 'impression')
  const leads = events.filter(e => e.event_type === 'lead_action')
  const articleReads = events.filter(e => e.event_type === 'article_read')
  const uniqueSessions = new Set(events.map(e => e.session_id).filter(Boolean)).size

  const topPages = topN(countBy(pageViews, e => e.page), 10)
  const topSearches = topN(countBy(searches, e => e.search_query), 10)
  const topListings = topN(countBy(listingClicks, e => e.listing_id), 10)
  const topCountries = topN(countBy(events, e => e.country), 10)
  const topCities = topN(countBy(events, e => e.city), 10)
  const deviceBreakdown = topN(countBy(events, e => e.device_type), 5)
  const browserBreakdown = topN(countBy(events, e => e.browser), 10)
  const referrerBreakdown = topN(
    countBy(pageViews, e => {
      if (!e.referrer) return '(direct)'
      try { return new URL(e.referrer).hostname } catch { return e.referrer }
    }),
    10
  )

  // Engagement averages
  const avgScrollByPage = avgGrouped(engagements, e => e.page, e => e.scroll_depth)
  const avgActiveByPage = avgGrouped(engagements, e => e.page, e => e.active_time)
  const avgTotalByPage = avgGrouped(engagements, e => e.page, e => e.total_time)

  // Impressions
  const impressionsBySection = topN(countBy(impressions, e => e.section), 15)

  // Leads
  const leadsByType = topN(countBy(leads, e => e.lead_type), 10)
  const leadsByListing = topN(countBy(leads, e => e.listing_id), 10)
  const ctr = pageViews.length > 0 ? ((listingClicks.length / pageViews.length) * 100).toFixed(2) : '0.00'

  // Dish searches
  const dishSearches = topN(
    countBy(
      searches.filter(e => {
        const q = (e.search_query ?? '').toLowerCase()
        return DISH_NAMES.some(d => q.includes(d))
      }),
      e => e.search_query
    ),
    15
  )

  // Articles
  const articlesBySlug = avgGrouped(articleReads, e => e.article_slug, e => e.scroll_depth)

  const chartDays = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Print-only title */}
        <div className="analytics-print-title mb-6">
          <h1 className="text-2xl font-bold">FilipinoFoodNearMe.org — Analytics Report — {rangeLabels[dateRange]}</h1>
          <p className="text-gray-500 text-sm">Generated {new Date().toLocaleString()}</p>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">FilipinoFoodNearMe.org · {rangeLabels[dateRange]}</p>
          </div>
          <div className="analytics-print-hidden flex items-center gap-3 flex-wrap">
            {/* Date range */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
              {(['24h', '7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${dateRange === r ? 'bg-[#0038A8] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {rangeLabels[r]}
                </button>
              ))}
            </div>
            {/* Export buttons */}
            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Export PDF
            </button>
            <a href="/admin" className="text-sm text-blue-600 hover:underline">← Admin Home</a>
          </div>
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Loading analytics data…</div>}

        {!loading && (
          <>
            {/* ── Overview cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Page Views', value: pageViews.length, color: 'bg-blue-50 border-blue-200' },
                { label: 'Unique Sessions', value: uniqueSessions, color: 'bg-green-50 border-green-200' },
                { label: 'Listing Clicks', value: listingClicks.length, color: 'bg-purple-50 border-purple-200' },
                { label: 'Searches', value: searches.length, color: 'bg-yellow-50 border-yellow-200' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-xl border p-5 ${color}`}>
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* ── Page views over time ── */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Page Views Over Time {dateRange === 'all' ? '(Last 30 Days Shown)' : `(${rangeLabels[dateRange]})`}
              </h2>
              {pageViews.length === 0
                ? <p className="text-gray-400 text-sm">No data yet.</p>
                : <TimelineChart events={pageViews} days={chartDays > 90 ? 30 : Math.max(chartDays, 1)} />
              }
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Top pages */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Pages</h2>
                {topPages.length === 0
                  ? <p className="text-gray-400 text-sm">No data yet.</p>
                  : <CSSBarChart data={topPages.map(([label, count]) => ({ label: label.length > 22 ? '…' + label.slice(-20) : label, count }))} />
                }
              </div>
              {/* Device breakdown */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Device Breakdown</h2>
                <DonutChart data={deviceBreakdown} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Top search queries */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Search Queries</h2>
                <DataTable
                  headers={['Query', 'Count']}
                  rows={topSearches.map(([q, c]) => [q, c])}
                  empty="No searches tracked yet."
                />
              </div>
              {/* Top clicked listings */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Clicked Listings</h2>
                {topListings.length === 0
                  ? <p className="text-gray-400 text-sm">No listing clicks tracked yet.</p>
                  : (
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 text-gray-500 font-medium">Listing ID</th><th className="text-right py-2 text-gray-500 font-medium">Clicks</th></tr></thead>
                      <tbody>
                        {topListings.map(([id, c]) => (
                          <tr key={id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2"><a href={`/admin/listings/${id}/edit`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">#{id}</a></td>
                            <td className="py-2 text-right font-medium text-gray-900">{c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Country */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Traffic by Country</h2>
                <DataTable headers={['Country', 'Events']} rows={topCountries.map(([c, n]) => [c, n])} empty="No geo data yet." />
              </div>
              {/* Browser */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Browser Breakdown</h2>
                <DataTable headers={['Browser', 'Events']} rows={browserBreakdown.map(([b, n]) => [b, n])} empty="No data yet." />
              </div>
            </div>

            {/* Referrer */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Referrer Sources</h2>
              {referrerBreakdown.length === 0
                ? <p className="text-gray-400 text-sm">No referrer data yet.</p>
                : <CSSBarChart data={referrerBreakdown.map(([label, count]) => ({ label: label.length > 28 ? label.slice(0, 26) + '…' : label, count }))} color="#7c3aed" />
              }
            </div>

            {/* ━━━━━━━━━━━━━━ ENGAGEMENT ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-t pt-8">Engagement</h2>
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Scroll Depth by Page</h3>
                <DataTable
                  headers={['Page', 'Avg %', 'N']}
                  rows={avgScrollByPage.map(([p, avg, n]) => [p.length > 20 ? '…' + p.slice(-18) : p, `${avg}%`, n])}
                  empty="No engagement data yet."
                />
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Active Time by Page</h3>
                <DataTable
                  headers={['Page', 'Avg s', 'N']}
                  rows={avgActiveByPage.map(([p, avg, n]) => [p.length > 20 ? '…' + p.slice(-18) : p, `${avg}s`, n])}
                  empty="No engagement data yet."
                />
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Total Time by Page</h3>
                <DataTable
                  headers={['Page', 'Avg s', 'N']}
                  rows={avgTotalByPage.map(([p, avg, n]) => [p.length > 20 ? '…' + p.slice(-18) : p, `${avg}s`, n])}
                  empty="No engagement data yet."
                />
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━ IMPRESSIONS ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Impressions</h2>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Impressions by Section</h3>
                {impressionsBySection.length === 0
                  ? <p className="text-gray-400 text-sm">No impression data yet.</p>
                  : <CSSBarChart data={impressionsBySection.map(([label, count]) => ({ label, count }))} color="#059669" />
                }
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Top Pages by Impressions</h3>
                <DataTable
                  headers={['Page', 'Impressions']}
                  rows={topN(countBy(impressions, e => e.page), 10).map(([p, n]) => [p.length > 28 ? '…' + p.slice(-26) : p, n])}
                  empty="No impression data yet."
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-base font-bold text-gray-700 mb-3">Top Cities by Events</h3>
              <p className="text-xs text-gray-400 mb-3">State-level breakdown requires region-level geo enrichment; showing top cities as proxy.</p>
              <DataTable
                headers={['City', 'Events']}
                rows={topCities.map(([c, n]) => [c, n])}
                empty="No city data yet."
              />
            </div>

            {/* ━━━━━━━━━━━━━━ LEAD ACTIONS ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Lead Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border bg-red-50 border-red-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{leads.length.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border bg-indigo-50 border-indigo-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Website Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{leads.filter(e => e.lead_type === 'website_click').length.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border bg-blue-50 border-blue-200 p-5">
                <p className="text-sm text-gray-500 mb-1">Directions Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{leads.filter(e => e.lead_type === 'directions_click').length.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border bg-green-50 border-green-200 p-5">
                <p className="text-sm text-gray-500 mb-1">CTR</p>
                <p className="text-3xl font-bold text-gray-900">{ctr}%</p>
                <p className="text-xs text-gray-400 mt-1">clicks / page views</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Lead Breakdown by Type</h3>
                <DonutChart data={leadsByType} />
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Top Listings by Lead Actions</h3>
                {leadsByListing.length === 0
                  ? <p className="text-gray-400 text-sm">No lead data yet.</p>
                  : (
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 text-gray-500 font-medium">Listing</th><th className="text-right py-2 text-gray-500 font-medium">Leads</th></tr></thead>
                      <tbody>
                        {leadsByListing.map(([id, c]) => (
                          <tr key={id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2"><a href={`/admin/listings/${id}/edit`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">#{id}</a></td>
                            <td className="py-2 text-right font-medium text-gray-900">{c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━ SEARCH INTELLIGENCE ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Search Intelligence</h2>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">Filipino Dish Name Searches</h3>
                <DataTable
                  headers={['Dish Query', 'Count']}
                  rows={dishSearches.map(([q, c]) => [q, c])}
                  empty="No dish-related searches yet."
                />
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-bold text-gray-700 mb-3">All Top Search Queries</h3>
                <DataTable headers={['Query', 'Count']} rows={topSearches.map(([q, c]) => [q, c])} empty="No searches tracked yet." />
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━ CONTENT ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Content</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-base font-bold text-gray-700 mb-3">Articles Read (80%+ scroll)</h3>
              {articlesBySlug.length === 0
                ? <p className="text-gray-400 text-sm">No article reads tracked yet.</p>
                : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left py-2 text-gray-500 font-medium">Article Slug</th><th className="text-right py-2 text-gray-500 font-medium">Reads</th><th className="text-right py-2 text-gray-500 font-medium">Avg Scroll %</th></tr></thead>
                    <tbody>
                      {articlesBySlug.map(([slug, avgScroll, reads]) => (
                        <tr key={slug} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 text-gray-700">{slug}</td>
                          <td className="py-2 text-right text-gray-900 font-medium">{reads}</td>
                          <td className="py-2 text-right text-gray-900 font-medium">{avgScroll}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            </div>

            {/* ━━━━━━━━━━━━━━ LIVE ACTIVITY FEED ━━━━━━━━━━━━━━ */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Live Activity Feed</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Last 50 events · auto-refreshes every 30s</p>
                <button
                  onClick={loadLiveEvents}
                  className="analytics-print-hidden text-xs text-blue-600 hover:underline"
                >
                  Refresh now
                </button>
              </div>
              {liveEvents.length === 0
                ? <p className="text-gray-400 text-sm">No events yet.</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-gray-500 font-medium pr-3">Time</th>
                          <th className="text-left py-2 text-gray-500 font-medium pr-3">Type</th>
                          <th className="text-left py-2 text-gray-500 font-medium pr-3">Page / Detail</th>
                          <th className="text-left py-2 text-gray-500 font-medium pr-3">Device</th>
                          <th className="text-left py-2 text-gray-500 font-medium">Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveEvents.map(e => (
                          <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-1.5 pr-3 text-gray-400 whitespace-nowrap">{timeAgo(e.created_at)}</td>
                            <td className="py-1.5 pr-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${EVENT_BADGE_COLORS[e.event_type] ?? 'bg-gray-100 text-gray-600'}`}>
                                {e.event_type}
                              </span>
                            </td>
                            <td className="py-1.5 pr-3 text-gray-700 truncate max-w-[180px]">
                              {e.search_query
                                ? `"${e.search_query}"`
                                : e.article_slug
                                ? e.article_slug
                                : e.section
                                ? `[${e.section}]`
                                : e.listing_id
                                ? `#${e.listing_id}`
                                : e.page?.replace(/^\/listings\//, '')?.slice(0, 30) ?? '—'
                              }
                            </td>
                            <td className="py-1.5 pr-3 text-gray-500">{e.device_type ?? '—'}</td>
                            <td className="py-1.5 text-gray-500">{e.country ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
}
