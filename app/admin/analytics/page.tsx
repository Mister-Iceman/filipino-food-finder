'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

const DISH_NAMES = [
  'adobo', 'lechon', 'sinigang', 'kare-kare', 'pancit', 'lumpia',
  'halo-halo', 'sisig', 'ube', 'balut', 'bibingka', 'pan de sal',
  'dinuguan', 'tapsilog', 'palabok',
]

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface KPIData {
  totalActiveListings: number
  totalListingsAllTime: number
  citiesCovered: number
  statesCovered: number
  submissionsThisMonth: number
  pendingSubmissions: number
  listingsByCategory: { category: string; count: number }[]
  topCitiesByListings: { city: string; count: number }[]
  topStatesByListings: { state: string; count: number }[]
  monthlyGrowth: { month: string; count: number }[]
  contentHealth: {
    total: number
    withPhotos: number
    withDescriptions: number
    withPhones: number
    withWebsites: number
    withHours: number
  }
  pipeline: { pending: number; active: number; featured: number; rejected: number }
  recentActivity: { id: number; name: string; city: string; status: string; created_at: string }[]
}

interface GA4Data {
  connected: boolean
  users30d?: number
  newUsers30d?: number
  sessions30d?: number
  pageViews30d?: number
  bounceRate?: number
  avgSessionDuration?: number
  avgSessionDurationFormatted?: string
  usersToday?: number
  usersThisWeek?: number
  dailyTraffic?: { date: string; users: number }[]
  topPages?: { path: string; views: number; avgTime: number }[]
  trafficSources?: { source: string; sessions: number; pct: number }[]
  topCities?: { city: string; users: number }[]
  deviceBreakdown?: { device: string; users: number }[]
  topCountries?: { country: string; users: number }[]
  monthlyUniqueVisitors?: number
  monthlyPageViews?: number
  topTrafficSource?: string
}

type DateRange = '24h' | '7d' | '30d' | '90d' | 'all'

const rangeLabels: Record<DateRange, string> = {
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  all: 'All Time',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function isJunkPath(page: string | null | undefined): boolean {
  return !!page && /[%\[\]$]/.test(page)
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

function formatPagePath(path: string | null | undefined): string {
  if (!path) return '—'
  const junk = isJunkPath(path)
  const prefix = junk ? '⚠️ ' : ''
  const clean = path.replace(/\/$/, '')
  const lc = clean.toLowerCase()
  if (lc === '' || lc === '/') return 'Homepage'
  if (lc === '/directory') return prefix + 'Directory'
  if (lc === '/events') return prefix + 'Events'
  if (lc === '/cultural-knowledge-base') return prefix + 'Cultural Knowledge Base'
  if (lc === '/newsroom') return prefix + 'Newsroom'
  if (lc === '/add-business') return prefix + 'Add Business'
  if (lc === '/contact') return prefix + 'Contact'
  if (lc.startsWith('/dishes/')) {
    const dish = lc.replace('/dishes/', '')
    return prefix + 'Dishes: ' + toTitleCase(dish.replace(/-/g, ' '))
  }
  const segments = clean.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? clean
  return prefix + toTitleCase(last.replace(/-/g, ' '))
}

function n(num: number | undefined | null): string {
  return (num ?? 0).toLocaleString()
}

function pct(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

function contentGrade(health: KPIData['contentHealth']): { grade: string; score: number; color: string } {
  const total = health.total
  if (total === 0) return { grade: 'N/A', score: 0, color: '#9ca3af' }
  const scores = [
    pct(health.withPhotos, total),
    pct(health.withDescriptions, total),
    pct(health.withPhones, total),
    pct(health.withWebsites, total),
    pct(health.withHours, total),
  ]
  const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
  if (avg >= 80) return { grade: 'A', score: avg, color: '#16a34a' }
  if (avg >= 60) return { grade: 'B', score: avg, color: '#0038A8' }
  if (avg >= 40) return { grade: 'C', score: avg, color: '#d97706' }
  return { grade: 'D', score: avg, color: '#dc2626' }
}

// ─── UI Components ─────────────────────────────────────────────────────────────

function Skeleton({ h = 'h-8', w = 'w-full' }: { h?: string; w?: string }) {
  return <div className={`${h} ${w} bg-gray-200 rounded animate-pulse`} />
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-t pt-8">{children}</h2>
  )
}

function KPICard({
  label, value, sub, color = 'bg-blue-50 border-blue-200', badge
}: {
  label: string; value: string | number; sub?: string; color?: string; badge?: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border p-5 ${color}`}>
      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">{label} {badge}</p>
      <p className="text-3xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function ProgressBar({ label, value, total, color = '#0038A8' }: {
  label: string; value: number; total: number; color?: string
}) {
  const percentage = pct(value, total)
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {n(value)} / {n(total)} <span className="text-gray-400 font-normal">({percentage}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function GoldHBar({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-2">
      {data.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-40 text-right text-gray-600 shrink-0 text-xs truncate">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(count / max) * 100}%`, backgroundColor: '#FCD116' }}
            />
          </div>
          <span className="w-10 text-gray-700 text-xs font-semibold text-right">{count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function GoldVBar({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-40">
      {data.map(({ label, count }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1 group">
          <span className="text-xs text-gray-500 font-medium">{count > 0 ? count : ''}</span>
          <div className="relative w-full flex items-end justify-center" style={{ height: '100px' }}>
            <div
              className="w-full rounded-t"
              style={{
                height: `${Math.max((count / max) * 100, count > 0 ? 4 : 0)}%`,
                backgroundColor: '#FCD116',
              }}
              title={`${label}: ${count}`}
            />
          </div>
          <span className="text-[9px] text-gray-500 text-center leading-tight whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  )
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

function GA4DailyChart({ data }: { data: { date: string; users: number }[] }) {
  const max = Math.max(...data.map(d => d.users), 1)
  return (
    <div className="flex items-end gap-0.5 h-32">
      {data.map(({ date, users }) => {
        const label = `${date.slice(4, 6)}/${date.slice(6, 8)}`
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex items-end justify-center" style={{ height: '100px' }}>
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max((users / max) * 100, users > 0 ? 4 : 0)}%`,
                  backgroundColor: '#FCD116',
                }}
                title={`${date}: ${users.toLocaleString()} users`}
              />
            </div>
            <span className="text-[9px] text-gray-400 rotate-45 origin-left whitespace-nowrap hidden lg:block">{label}</span>
          </div>
        )
      })}
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
            <span className="text-gray-500">({s.count.toLocaleString()} · {Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataTable({ headers, rows, empty = 'No data yet.' }: {
  headers: string[]; rows: (string | number)[][]; empty?: string
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

function GA4SetupBox() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <h3 className="text-base font-bold text-amber-900 mb-2">Connect Google Analytics 4</h3>
      <p className="text-sm text-amber-800 mb-4">
        GA4 credentials are not configured. Add these to your <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable traffic data:
      </p>
      <div className="bg-white rounded-lg border border-amber-200 p-4 font-mono text-xs text-gray-700 space-y-1">
        <p><span className="text-amber-700">GA4_PROPERTY_ID</span>=<span className="text-gray-500">123456789</span></p>
        <p><span className="text-amber-700">GA4_CLIENT_EMAIL</span>=<span className="text-gray-500">name@project.iam.gserviceaccount.com</span></p>
        <p><span className="text-amber-700">GA4_PRIVATE_KEY</span>=<span className="text-gray-500">-----BEGIN PRIVATE KEY-----...</span></p>
      </div>
      <div className="mt-4 text-xs text-amber-700 space-y-1">
        <p>1. Go to Google Analytics → Admin → Service Accounts → Create Service Account</p>
        <p>2. Grant it "Viewer" role on your GA4 property</p>
        <p>3. Create a JSON key — copy <strong>client_email</strong> and <strong>private_key</strong></p>
        <p>4. Find your Property ID in GA4 → Admin → Property Settings</p>
      </div>
    </div>
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

// ─── Main Dashboard ─────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Behavioral analytics (analytics_events)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [liveEvents, setLiveEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  // Supabase KPIs
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [kpisLoading, setKpisLoading] = useState(false)

  // GA4
  const [ga4, setGa4] = useState<GA4Data | null>(null)
  const [ga4Loading, setGa4Loading] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  const loadKPIs = useCallback(async () => {
    setKpisLoading(true)
    try {
      const res = await fetch('/api/admin/analytics-kpis')
      if (res.ok) setKpis(await res.json())
    } catch { /* fail silently */ }
    setKpisLoading(false)
  }, [])

  const loadGA4 = useCallback(async () => {
    setGa4Loading(true)
    try {
      const res = await fetch('/api/admin/ga4-stats')
      if (res.ok) setGa4(await res.json())
    } catch { /* fail silently */ }
    setGa4Loading(false)
  }, [])

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
    loadKPIs()
    loadGA4()
    loadEvents()
    loadLiveEvents()
  }, [isAuthenticated, loadEvents])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(loadLiveEvents, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, loadLiveEvents])

  const exportCSV = () => {
    const headers = ['event_type','page','section','referrer','device_type','browser','country','city','search_query','listing_id','article_slug','lead_type','scroll_depth','active_time','total_time','session_id','created_at']
    const rows = events.map(e =>
      headers.map(h => {
        const val = (e as unknown as Record<string, unknown>)[h]
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🇵🇭</div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Login</h1>
            <p className="text-gray-500 text-sm mt-1">FilipinoFoodNearMe.org</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-[#0038A8] outline-none"
            />
            <button type="submit" className="w-full bg-[#0038A8] hover:bg-[#002a80] text-white font-bold py-3 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── Derived behavioral analytics data ─────────────────────────────────────
  const cleanEvents = events.filter(e => !isJunkPath(e.page))
  const pageViews = cleanEvents.filter(e => e.event_type === 'page_view')
  const listingClicks = cleanEvents.filter(e => e.event_type === 'listing_click')
  const searches = cleanEvents.filter(e => e.event_type === 'search')
  const engagements = cleanEvents.filter(e => e.event_type === 'engagement')
  const impressions = cleanEvents.filter(e => e.event_type === 'impression')
  const leads = cleanEvents.filter(e => e.event_type === 'lead_action')
  const articleReads = cleanEvents.filter(e => e.event_type === 'article_read')
  const uniqueSessions = new Set(cleanEvents.map(e => e.session_id).filter(Boolean)).size

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
  const avgScrollByPage = avgGrouped(engagements, e => e.page, e => e.scroll_depth)
  const avgActiveByPage = avgGrouped(engagements, e => e.page, e => e.active_time)
  const avgTotalByPage = avgGrouped(engagements, e => e.page, e => e.total_time)
  const impressionsBySection = topN(countBy(impressions, e => e.section), 15)
  const leadsByType = topN(countBy(leads, e => e.lead_type), 10)
  const leadsByListing = topN(countBy(leads, e => e.listing_id), 10)
  const ctr = pageViews.length > 0 ? ((listingClicks.length / pageViews.length) * 100).toFixed(2) : '0.00'
  const dishSearches = topN(
    countBy(
      searches.filter(e => DISH_NAMES.some(d => (e.search_query ?? '').toLowerCase().includes(d))),
      e => e.search_query
    ),
    15
  )
  const articlesBySlug = avgGrouped(articleReads, e => e.article_slug, e => e.scroll_depth)
  const chartDays = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30

  const grade = kpis ? contentGrade(kpis.contentHealth) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Print-only title */}
        <div className="analytics-print-title mb-6">
          <h1 className="text-2xl font-bold">FilipinoFoodNearMe.org — Analytics Report</h1>
          <p className="text-gray-500 text-sm">Generated {new Date().toLocaleString()}</p>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">FilipinoFoodNearMe.org · Admin View</p>
          </div>
          <div className="analytics-print-hidden flex items-center gap-3 flex-wrap">
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
            <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Export CSV
            </button>
            <button onClick={() => window.print()} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Export PDF
            </button>
            <a href="/admin" className="text-sm text-[#0038A8] hover:underline">← Admin Home</a>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 1 — TOP KPI STRIP (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpisLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-gray-50 p-5">
                <Skeleton h="h-4" w="w-20" /><div className="mt-2"><Skeleton h="h-8" /></div>
              </div>
            ))
          ) : kpis ? (
            <>
              <KPICard label="Active Listings" value={kpis.totalActiveListings} color="bg-blue-50 border-blue-200" />
              <KPICard label="Total All-Time" value={kpis.totalListingsAllTime} color="bg-indigo-50 border-indigo-200" />
              <KPICard label="Cities Covered" value={kpis.citiesCovered} color="bg-green-50 border-green-200" />
              <KPICard label="States Covered" value={kpis.statesCovered} color="bg-teal-50 border-teal-200" />
              <KPICard label="New This Month" value={kpis.submissionsThisMonth} color="bg-yellow-50 border-yellow-200" sub="submissions" />
              <KPICard
                label="Pending Review"
                value={kpis.pendingSubmissions}
                color={kpis.pendingSubmissions > 0 ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}
                badge={kpis.pendingSubmissions > 0
                  ? <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{kpis.pendingSubmissions}</span>
                  : null
                }
              />
            </>
          ) : (
            <div className="col-span-6 text-center text-gray-400 text-sm py-4">Unable to load KPIs</div>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 2 — TRAFFIC OVERVIEW (GA4)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Traffic Overview · Last 30 Days (GA4)</SectionHeading>
        {ga4Loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-gray-50 p-5">
                <Skeleton h="h-4" w="w-24" /><div className="mt-2"><Skeleton h="h-8" /></div>
              </div>
            ))}
          </div>
        ) : !ga4 || !ga4.connected ? (
          <div className="mb-6"><GA4SetupBox /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KPICard label="Total Users" value={ga4.users30d ?? 0} color="bg-blue-50 border-blue-200" />
            <KPICard label="New Users" value={ga4.newUsers30d ?? 0} color="bg-indigo-50 border-indigo-200" />
            <KPICard label="Sessions" value={ga4.sessions30d ?? 0} color="bg-purple-50 border-purple-200" />
            <KPICard label="Page Views" value={ga4.pageViews30d ?? 0} color="bg-pink-50 border-pink-200" />
            <KPICard label="Bounce Rate" value={`${ga4.bounceRate ?? 0}%`} color="bg-orange-50 border-orange-200" />
            <KPICard label="Avg Session" value={ga4.avgSessionDurationFormatted ?? '—'} color="bg-green-50 border-green-200" />
            <KPICard label="Users Today" value={ga4.usersToday ?? 0} color="bg-teal-50 border-teal-200" />
            <KPICard label="Users This Week" value={ga4.usersThisWeek ?? 0} color="bg-cyan-50 border-cyan-200" />
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 3 — DAILY TRAFFIC CHART (GA4)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Visitors — Last 30 Days (GA4)</h2>
          {!ga4 || !ga4.connected ? (
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Connect GA4 to see daily traffic chart
            </div>
          ) : (ga4.dailyTraffic ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm">No daily traffic data.</p>
          ) : (
            <GA4DailyChart data={ga4.dailyTraffic!} />
          )}
        </Card>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTIONS 4 & 5 — TOP PAGES + TRAFFIC SOURCES (GA4)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Pages (GA4)</h2>
            {!ga4 || !ga4.connected ? (
              <p className="text-gray-400 text-sm">Connect GA4 to see top pages.</p>
            ) : (
              <DataTable
                headers={['Page', 'Views', 'Avg Time']}
                rows={(ga4.topPages ?? []).map(p => [
                  p.path.length > 35 ? '…' + p.path.slice(-34) : p.path,
                  p.views.toLocaleString(),
                  `${Math.floor(p.avgTime / 60)}m ${p.avgTime % 60}s`,
                ])}
                empty="No page data yet."
              />
            )}
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Traffic Sources (GA4)</h2>
            {!ga4 || !ga4.connected ? (
              <p className="text-gray-400 text-sm">Connect GA4 to see traffic sources.</p>
            ) : (
              <DonutChart
                data={(ga4.trafficSources ?? []).map(s => [s.source, s.sessions] as [string, number])}
              />
            )}
          </Card>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 6 — AUDIENCE INSIGHTS (GA4)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <h2 className="text-base font-bold text-gray-800 mb-3">Top Cities (GA4)</h2>
            {!ga4 || !ga4.connected ? (
              <p className="text-gray-400 text-sm">Connect GA4.</p>
            ) : (
              <DataTable
                headers={['City', 'Users']}
                rows={(ga4.topCities ?? []).map(c => [c.city, c.users.toLocaleString()])}
                empty="No city data."
              />
            )}
          </Card>
          <Card>
            <h2 className="text-base font-bold text-gray-800 mb-3">Device Breakdown (GA4)</h2>
            {!ga4 || !ga4.connected ? (
              <p className="text-gray-400 text-sm">Connect GA4.</p>
            ) : (
              <DonutChart
                data={(ga4.deviceBreakdown ?? []).map(d => [
                  d.device.charAt(0).toUpperCase() + d.device.slice(1),
                  d.users,
                ] as [string, number])}
              />
            )}
          </Card>
          <Card>
            <h2 className="text-base font-bold text-gray-800 mb-3">Top Countries (GA4)</h2>
            {!ga4 || !ga4.connected ? (
              <p className="text-gray-400 text-sm">Connect GA4.</p>
            ) : (
              <DataTable
                headers={['Country', 'Users']}
                rows={(ga4.topCountries ?? []).map(c => [c.country, c.users.toLocaleString()])}
                empty="No country data."
              />
            )}
          </Card>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 7 — LISTINGS BY CATEGORY (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Listings by Category</SectionHeading>
        <Card className="mb-6">
          {kpisLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h="h-5" />)}</div>
          ) : !kpis || kpis.listingsByCategory.length === 0 ? (
            <p className="text-gray-400 text-sm">No category data yet.</p>
          ) : (
            <GoldHBar data={kpis.listingsByCategory.map(c => ({ label: c.category, count: c.count }))} />
          )}
        </Card>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 8 — GEOGRAPHIC COVERAGE (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Geographic Coverage</SectionHeading>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-base font-bold text-gray-800 mb-3">Top 10 Cities by Listings</h2>
            {kpisLoading ? (
              <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h="h-4" />)}</div>
            ) : !kpis || kpis.topCitiesByListings.length === 0 ? (
              <p className="text-gray-400 text-sm">No city data yet.</p>
            ) : (
              <DataTable
                headers={['City', 'Listings']}
                rows={kpis.topCitiesByListings.map(c => [c.city, c.count.toLocaleString()])}
              />
            )}
          </Card>
          <Card>
            <h2 className="text-base font-bold text-gray-800 mb-3">State Coverage</h2>
            {kpisLoading ? (
              <div className="flex flex-wrap gap-2">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} h="h-8" w="w-16" />)}</div>
            ) : !kpis || kpis.topStatesByListings.length === 0 ? (
              <p className="text-gray-400 text-sm">No state data yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {kpis.topStatesByListings.map((s, i) => (
                  <div
                    key={s.state}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold text-white flex items-center gap-1.5"
                    style={{ backgroundColor: i < 3 ? '#FCD116' : '#0038A8', color: i < 3 ? '#1a1a1a' : 'white' }}
                    title={`${s.count} listings`}
                  >
                    {s.state}
                    <span className="text-xs font-normal opacity-80">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 9 — GROWTH TRENDS (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Growth Trends · Last 12 Months</SectionHeading>
        <Card className="mb-6">
          {kpisLoading ? (
            <div className="h-40 bg-gray-50 rounded animate-pulse" />
          ) : !kpis || kpis.monthlyGrowth.length === 0 ? (
            <p className="text-gray-400 text-sm">No growth data yet.</p>
          ) : (
            <GoldVBar data={kpis.monthlyGrowth.map(m => ({ label: m.month, count: m.count }))} />
          )}
        </Card>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 10 — CONTENT HEALTH SCORECARD (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Content Health Scorecard</SectionHeading>
        <Card className="mb-6">
          {kpisLoading ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h="h-8" />)}</div>
          ) : !kpis ? (
            <p className="text-gray-400 text-sm">Unable to load health data.</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <ProgressBar label="Listings with Photos" value={kpis.contentHealth.withPhotos} total={kpis.contentHealth.total} color="#0038A8" />
                <ProgressBar label="Listings with Descriptions" value={kpis.contentHealth.withDescriptions} total={kpis.contentHealth.total} color="#0038A8" />
                <ProgressBar label="Listings with Phone Numbers" value={kpis.contentHealth.withPhones} total={kpis.contentHealth.total} color="#0038A8" />
                <ProgressBar label="Listings with Websites" value={kpis.contentHealth.withWebsites} total={kpis.contentHealth.total} color="#FCD116" />
                <ProgressBar label="Listings with Hours" value={kpis.contentHealth.withHours} total={kpis.contentHealth.total} color="#FCD116" />
              </div>
              {grade && (
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg"
                    style={{ backgroundColor: grade.color }}
                  >
                    {grade.grade}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Overall Grade</p>
                  <p className="text-xs text-gray-500">Avg {grade.score}% complete</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 11 — SPONSOR-READY METRICS PANEL
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Sponsor-Ready Media Kit</SectionHeading>
        <div className="rounded-xl border-2 border-[#FCD116] bg-white p-6 mb-6 shadow">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-gray-900">Your Media Kit Numbers</h2>
            <span className="ml-auto text-xs bg-[#FCD116] text-gray-900 font-bold px-2 py-1 rounded-full">LIVE DATA</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Platform Stats */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Platform Stats</h3>
              <div className="space-y-2">
                {[
                  ['Total Listings Nationwide', kpis ? n(kpis.totalActiveListings) : '—'],
                  ['Cities Covered', kpis ? n(kpis.citiesCovered) : '—'],
                  ['States Covered', kpis ? n(kpis.statesCovered) : '—'],
                  ['Business Categories', kpis ? n(kpis.listingsByCategory.length) : '—'],
                  ['Launch Year', '2022'],
                  ['Sister Site', 'FilipinoEventsNearMe.org'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Audience Stats */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Audience Demographics</h3>
              <div className="space-y-2">
                {[
                  ['Filipino-Americans in US', '4.6 million'],
                  ['FilAm Buying Power', '$100 billion+'],
                  ['Median Household Income', '$98,000'],
                  ['Rank Among Asian-Americans', '#2 largest group'],
                  ['Monthly Unique Visitors', ga4?.connected ? n(ga4.monthlyUniqueVisitors) : 'Connect GA4'],
                  ['Monthly Page Views', ga4?.connected ? n(ga4.monthlyPageViews) : 'Connect GA4'],
                  ['Avg Session Duration', ga4?.connected ? (ga4.avgSessionDurationFormatted ?? '—') : 'Connect GA4'],
                  ['Top Traffic Source', ga4?.connected ? (ga4.topTrafficSource ?? '—') : 'Connect GA4'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-sm font-bold ${value === 'Connect GA4' ? 'text-gray-400' : 'text-gray-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-500">Platform stats are live from database. Audience demographics are US Census / community research data.</p>
            <a
              href="/advertise"
              className="bg-[#0038A8] hover:bg-[#002a80] text-white font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              View Ad Packages →
            </a>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 12 — RECENT ACTIVITY FEED (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Recent Activity Feed</SectionHeading>
        <Card className="mb-6">
          <p className="text-xs text-gray-400 mb-4">Last 20 business submissions</p>
          {kpisLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h="h-10" />)}</div>
          ) : !kpis || kpis.recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent activity.</p>
          ) : (
            <div className="space-y-2">
              {kpis.recentActivity.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="font-medium text-gray-900 text-sm truncate flex-1">{item.name}</span>
                  <span className="text-gray-500 text-xs shrink-0">{item.city}</span>
                  <span className="text-gray-400 text-xs shrink-0">{timeAgo(item.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 13 — PIPELINE MANAGEMENT (Supabase)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>Pipeline Management</SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Pending Review', value: kpis?.pipeline.pending ?? '—', color: 'bg-yellow-50 border-yellow-300' },
            { label: 'Active Listings', value: kpis?.pipeline.active ?? '—', color: 'bg-green-50 border-green-200' },
            { label: 'Featured', value: kpis?.pipeline.featured ?? '—', color: 'bg-blue-50 border-blue-200' },
            { label: 'Rejected', value: kpis?.pipeline.rejected ?? '—', color: 'bg-red-50 border-red-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border p-5 ${color}`}>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap mb-8">
          <a href="/admin/submissions" className="bg-[#0038A8] hover:bg-[#002a80] text-white font-bold px-5 py-2.5 rounded-lg text-sm">
            Review Pending →
          </a>
          <a href="/admin" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-lg text-sm">
            Add Listing +
          </a>
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm">
            Export CSV ↓
          </button>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 14 — NETWORK COMPARISON
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <SectionHeading>FilAm Network Comparison</SectionHeading>
        <div className="rounded-xl border border-[#0038A8] bg-gradient-to-br from-blue-50 to-white p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            {/* FFNM */}
            <div className="bg-white rounded-xl border-2 border-[#0038A8] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🍽️</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">FilipinoFoodNearMe.org</p>
                  <p className="text-xs text-gray-500">This site</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Food Businesses</span>
                  <span className="font-bold text-gray-900">{kpis ? n(kpis.totalActiveListings) : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cities Covered</span>
                  <span className="font-bold text-gray-900">{kpis ? n(kpis.citiesCovered) : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">States Covered</span>
                  <span className="font-bold text-gray-900">{kpis ? n(kpis.statesCovered) : '—'}</span>
                </div>
              </div>
            </div>
            {/* FENM */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">FilipinoEventsNearMe.org</p>
                  <p className="text-xs text-gray-500">Sister site</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Listed</span>
                  <span className="font-bold text-gray-900">56+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">States Covered</span>
                  <span className="font-bold text-gray-900">20+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-bold text-gray-900">Festivals, Fairs & More</span>
                </div>
              </div>
              <a
                href="https://filipinoeventsnearme.org"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-[#0038A8] hover:underline"
              >
                View FENM →
              </a>
            </div>
            {/* Combined */}
            <div className="bg-[#0038A8] text-white rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3">Combined Network Reach</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Total Listings + Events</span>
                  <span className="font-bold">{kpis ? n(kpis.totalActiveListings + 56) : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Cities (FFNM)</span>
                  <span className="font-bold">{kpis ? n(kpis.citiesCovered) : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">States (Combined)</span>
                  <span className="font-bold">{kpis ? `${kpis.statesCovered}+` : '—'}</span>
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-[#FCD116]">One network. Complete coverage.</p>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BEHAVIORAL ANALYTICS (analytics_events table)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="border-t-4 border-[#0038A8] pt-8 mt-2">
          <h2 className="text-3xl font-black text-gray-900 mb-1">Behavioral Analytics</h2>
          <p className="text-gray-500 mb-6 text-sm">Custom event tracking · {rangeLabels[dateRange]}</p>
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Loading analytics data…</div>}

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
            <Card className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Page Views Over Time {dateRange === 'all' ? '(Last 30 Days Shown)' : `(${rangeLabels[dateRange]})`}
              </h2>
              {pageViews.length === 0
                ? <p className="text-gray-400 text-sm">No data yet.</p>
                : <TimelineChart events={pageViews} days={chartDays > 90 ? 30 : Math.max(chartDays, 1)} />
              }
            </Card>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Pages</h2>
                {topPages.length === 0
                  ? <p className="text-gray-400 text-sm">No data yet.</p>
                  : <CSSBarChart data={topPages.map(([label, count]) => ({ label: formatPagePath(label), count }))} />
                }
              </Card>
              <Card>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Device Breakdown</h2>
                <DonutChart data={deviceBreakdown} />
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Search Queries</h2>
                <DataTable headers={['Query', 'Count']} rows={topSearches.map(([q, c]) => [q, c])} empty="No searches tracked yet." />
              </Card>
              <Card>
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
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Traffic by Country</h2>
                <DataTable headers={['Country', 'Events']} rows={topCountries.map(([c, n]) => [c, n])} empty="No geo data yet." />
              </Card>
              <Card>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Browser Breakdown</h2>
                <DataTable headers={['Browser', 'Events']} rows={browserBreakdown.map(([b, n]) => [b, n])} empty="No data yet." />
              </Card>
            </div>

            <Card className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Top 10 Referrer Sources</h2>
              {referrerBreakdown.length === 0
                ? <p className="text-gray-400 text-sm">No referrer data yet.</p>
                : <CSSBarChart data={referrerBreakdown.map(([label, count]) => ({ label: label.length > 28 ? label.slice(0, 26) + '…' : label, count }))} color="#7c3aed" />
              }
            </Card>

            {/* Engagement */}
            <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-t pt-8">Engagement</h2>
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Scroll Depth by Page</h3>
                <DataTable headers={['Page', 'Avg %', 'N']} rows={avgScrollByPage.map(([p, avg, n]) => [formatPagePath(p), `${avg}%`, n])} empty="No engagement data yet." />
              </Card>
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Active Time by Page</h3>
                <DataTable headers={['Page', 'Avg s', 'N']} rows={avgActiveByPage.map(([p, avg, n]) => [formatPagePath(p), `${avg}s`, n])} empty="No engagement data yet." />
              </Card>
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Avg Total Time by Page</h3>
                <DataTable headers={['Page', 'Avg s', 'N']} rows={avgTotalByPage.map(([p, avg, n]) => [formatPagePath(p), `${avg}s`, n])} empty="No engagement data yet." />
              </Card>
            </div>

            {/* Impressions */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Impressions</h2>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Impressions by Section</h3>
                {impressionsBySection.length === 0
                  ? <p className="text-gray-400 text-sm">No impression data yet.</p>
                  : <CSSBarChart data={impressionsBySection.map(([label, count]) => ({ label, count }))} color="#059669" />
                }
              </Card>
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Top Pages by Impressions</h3>
                <DataTable
                  headers={['Page', 'Impressions']}
                  rows={topN(countBy(impressions, e => e.page), 10).map(([p, n]) => [formatPagePath(p), n])}
                  empty="No impression data yet."
                />
              </Card>
            </div>
            <Card className="mb-6">
              <h3 className="text-base font-bold text-gray-700 mb-3">Top Cities by Events</h3>
              <DataTable headers={['City', 'Events']} rows={topCities.map(([c, n]) => [c, n])} empty="No city data yet." />
            </Card>

            {/* Lead Actions */}
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
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Lead Breakdown by Type</h3>
                <DonutChart data={leadsByType} />
              </Card>
              <Card>
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
              </Card>
            </div>

            {/* Search Intelligence */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Search Intelligence</h2>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">Filipino Dish Name Searches</h3>
                <DataTable headers={['Dish Query', 'Count']} rows={dishSearches.map(([q, c]) => [q, c])} empty="No dish-related searches yet." />
              </Card>
              <Card>
                <h3 className="text-base font-bold text-gray-700 mb-3">All Top Search Queries</h3>
                <DataTable headers={['Query', 'Count']} rows={topSearches.map(([q, c]) => [q, c])} empty="No searches tracked yet." />
              </Card>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Content Engagement</h2>
            <Card className="mb-6">
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
            </Card>

            {/* Live Activity Feed */}
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 border-t pt-8">Live Activity Feed</h2>
            <Card className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Last 50 events · auto-refreshes every 30s</p>
                <button onClick={loadLiveEvents} className="analytics-print-hidden text-xs text-blue-600 hover:underline">
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
                                : e.article_slug ? e.article_slug
                                : e.section ? `[${e.section}]`
                                : e.listing_id ? `#${e.listing_id}`
                                : formatPagePath(e.page)
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
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
