'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

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
}

type DateRange = '7d' | '30d' | '90d' | 'all'

function dateRangeStart(range: DateRange): Date | null {
  if (range === 'all') return null
  const d = new Date()
  if (range === '7d') d.setDate(d.getDate() - 7)
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
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDayBuckets(events: AnalyticsEvent[], days: number): { label: string; count: number }[] {
  const now = new Date()
  const buckets: { label: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dayStr = d.toISOString().slice(0, 10)
    const count = events.filter(e => e.created_at.slice(0, 10) === dayStr).length
    buckets.push({ label, count })
  }
  return buckets
}

function CSSBarChart({ data, color = '#0038A8' }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-1">
      {data.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-24 text-right text-gray-500 shrink-0 text-xs">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-8 text-gray-700 text-xs font-medium">{count}</span>
        </div>
      ))}
    </div>
  )
}

function TimelineChart({ events, days }: { events: AnalyticsEvent[]; days: number }) {
  const buckets = getDayBuckets(events, days)
  const max = Math.max(...buckets.map(b => b.count), 1)
  return (
    <div className="flex items-end gap-1 h-32">
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
  const colors = ['#0038A8', '#FCD116', '#CE1126', '#4ade80', '#f97316']
  let cumulativeAngle = 0

  const slices = data.map(([label, count], i) => {
    const pct = count / total
    const startAngle = cumulativeAngle
    cumulativeAngle += pct * 360
    return { label, count, pct, startAngle, color: colors[i % colors.length] }
  })

  const polarToXY = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) }
  }

  const arcPath = (start: number, end: number, r: number) => {
    const s = polarToXY(start, r)
    const e = polarToXY(end, r)
    const large = end - start > 180 ? 1 : 0
    return `M 50 50 L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
  }

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32 shrink-0">
        {slices.map((s) => (
          <path
            key={s.label}
            d={arcPath(s.startAngle, s.startAngle + s.pct * 360, 42)}
            fill={s.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        <circle cx="50" cy="50" r="22" fill="white" />
      </svg>
      <div className="space-y-1">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-700">{s.label}</span>
            <span className="text-gray-500">({s.count}, {Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return
    loadEvents()
  }, [isAuthenticated, dateRange])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const start = dateRangeStart(dateRange)
      let query = supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50000)
      if (start) {
        query = query.gte('created_at', start.toISOString())
      }
      const { data } = await query
      setEvents(data ?? [])
    } catch {
      // fail silently
    }
    setLoading(false)
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  const pageViews = events.filter(e => e.event_type === 'page_view')
  const listingClicks = events.filter(e => e.event_type === 'listing_click')
  const searches = events.filter(e => e.event_type === 'search')
  const uniqueSessions = new Set(events.map(e => e.session_id).filter(Boolean)).size

  const topPages = topN(countBy(pageViews, e => e.page), 10)
  const topSearches = topN(countBy(searches, e => e.search_query), 10)
  const topListings = topN(countBy(listingClicks, e => e.listing_id), 10)
  const topCountries = topN(countBy(events, e => e.country), 10)
  const deviceBreakdown = topN(countBy(events, e => e.device_type), 5)
  const browserBreakdown = topN(countBy(events, e => e.browser), 10)
  const referrerBreakdown = topN(
    countBy(pageViews, e => {
      if (!e.referrer) return '(direct)'
      try {
        return new URL(e.referrer).hostname
      } catch {
        return e.referrer
      }
    }),
    10
  )

  const chartDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30

  const rangeLabels: Record<DateRange, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    all: 'All Time',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">FilipinoFoodNearMe.org · {rangeLabels[dateRange]}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date range buttons */}
            <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1">
              {(['7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    dateRange === r
                      ? 'bg-[#0038A8] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {rangeLabels[r]}
                </button>
              ))}
            </div>
            <a
              href="/admin"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Admin Home
            </a>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400">Loading analytics data…</div>
        )}

        {!loading && (
          <>
            {/* Overview cards */}
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

            {/* Page views over time */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Page Views Over Time ({dateRange === 'all' ? 'Last 30 Days Shown' : rangeLabels[dateRange]})
              </h2>
              {pageViews.length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet.</p>
              ) : (
                <TimelineChart events={pageViews} days={chartDays > 90 ? 30 : chartDays} />
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Top pages */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Pages</h2>
                {topPages.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet.</p>
                ) : (
                  <CSSBarChart data={topPages.map(([label, count]) => ({ label: label.length > 22 ? '…' + label.slice(-20) : label, count }))} />
                )}
              </div>

              {/* Device breakdown */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Device Breakdown</h2>
                {deviceBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet.</p>
                ) : (
                  <DonutChart data={deviceBreakdown} />
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Top search queries */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Search Queries</h2>
                {topSearches.length === 0 ? (
                  <p className="text-gray-400 text-sm">No searches tracked yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Query</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSearches.map(([q, c]) => (
                        <tr key={q} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 text-gray-700">{q}</td>
                          <td className="py-2 text-right text-gray-900 font-medium">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Top clicked listings */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Clicked Listings</h2>
                {topListings.length === 0 ? (
                  <p className="text-gray-400 text-sm">No listing clicks tracked yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Listing ID</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topListings.map(([id, c]) => (
                        <tr key={id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 text-gray-700">
                            <a
                              href={`/admin/listings/${id}/edit`}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              #{id}
                            </a>
                          </td>
                          <td className="py-2 text-right text-gray-900 font-medium">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Traffic by country */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Traffic by Country</h2>
                {topCountries.length === 0 ? (
                  <p className="text-gray-400 text-sm">No geo data yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Country</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Events</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCountries.map(([country, c]) => (
                        <tr key={country} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 text-gray-700">{country}</td>
                          <td className="py-2 text-right text-gray-900 font-medium">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Browser breakdown */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Browser Breakdown</h2>
                {browserBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Browser</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Events</th>
                      </tr>
                    </thead>
                    <tbody>
                      {browserBreakdown.map(([browser, c]) => (
                        <tr key={browser} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 text-gray-700">{browser}</td>
                          <td className="py-2 text-right text-gray-900 font-medium">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Referrer sources */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Referrer Sources</h2>
              {referrerBreakdown.length === 0 ? (
                <p className="text-gray-400 text-sm">No referrer data yet.</p>
              ) : (
                <CSSBarChart
                  data={referrerBreakdown.map(([label, count]) => ({ label: label.length > 28 ? label.slice(0, 26) + '…' : label, count }))}
                  color="#7c3aed"
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
