'use client'

import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

function n(v: number | undefined | null) { return (v ?? 0).toLocaleString() }
function pct(a: number, b: number) { return b === 0 ? '0' : Math.round((a / b) * 100) + '%' }

export default function SponsorReport() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [kpis, setKpis] = useState<Record<string, any> | null>(null)
  const [fp, setFp] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(false)
  const generatedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    Promise.all([
      fetch('/api/admin/analytics-kpis').then(r => r.ok ? r.json() : null),
      fetch('/api/admin/analytics-fp?days=30').then(r => r.ok ? r.json() : null),
    ]).then(([k, f]) => {
      setKpis(k)
      setFp(f)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🇵🇭</div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsor Report</h1>
            <p className="text-gray-500 text-sm mt-1">Admin Access Required</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-[#0038A8] text-white font-bold py-3 rounded-lg">
              View Report
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading report data…</p>
      </div>
    )
  }

  const totalListings = kpis?.totalActiveListings ?? 0
  const cities = kpis?.citiesCovered ?? 0
  const states = kpis?.statesCovered ?? 0
  const sessions = fp?.overview?.totalSessions ?? 0
  const visitors = fp?.overview?.uniqueVisitors ?? 0
  const avgDuration = fp?.overview?.avgDuration ?? 0
  const avgPages = fp?.overview?.avgPageCount ?? '0'

  const deviceBreakdown: Record<string, number> = fp?.deviceBreakdown ?? {}
  const totalDevices = Object.values(deviceBreakdown).reduce((s: number, v) => s + (v as number), 0)
  const mobileCount = (deviceBreakdown['mobile'] ?? 0) + (deviceBreakdown['tablet'] ?? 0)
  const topCountries: any[] = fp?.topCountries ?? []
  const topPages: any[] = (fp?.topPages ?? []).slice(0, 8)
  const topListings: any[] = (fp?.topListings ?? []).slice(0, 8)
  const topSearches: any[] = (fp?.topSearches ?? []).slice(0, 8)
  const listingsByCategory: any[] = kpis?.listingsByCategory ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Print / export toolbar */}
      <div className="print:hidden bg-gray-100 border-b px-6 py-3 flex items-center gap-4">
        <a href="/admin/analytics" className="text-[#0038A8] text-sm hover:underline">← Back to Dashboard</a>
        <button
          onClick={() => window.print()}
          className="bg-[#0038A8] text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Print / Save as PDF
        </button>
        <p className="text-sm text-gray-500">Use browser Print → Save as PDF for sponsor delivery</p>
      </div>

      {/* Report content */}
      <div className="max-w-4xl mx-auto px-8 py-12 print:px-6 print:py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-[#0038A8]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🇵🇭</span>
              <div>
                <h1 className="text-2xl font-bold text-[#0038A8]">FilipinoFoodNearMe.org</h1>
                <p className="text-sm text-gray-500">The #1 Community Filipino Food Directory in America</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Sponsor Media Kit</p>
            <p className="font-semibold text-gray-900">Last 30 Days</p>
            <p className="text-xs text-gray-400 mt-1">Generated: {generatedAt}</p>
          </div>
        </div>

        {/* Mission statement */}
        <div className="bg-[#0038A8] text-white rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-2">Why Filipino Food Near Me?</h2>
          <p className="text-sm leading-relaxed opacity-90">
            The only community-built Filipino food directory in the US — connecting the Filipino-American diaspora
            with authentic restaurants, bakeries, grocery stores, and food trucks in their cities.
            Zero paywalls, community verified, hyper-local.
          </p>
        </div>

        {/* Directory Stats */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Directory Coverage</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#0038A8]">{n(totalListings)}</p>
            <p className="text-sm text-gray-500 mt-1">Active Listings</p>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#0038A8]">{n(cities)}</p>
            <p className="text-sm text-gray-500 mt-1">Cities Covered</p>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#0038A8]">{n(states)}</p>
            <p className="text-sm text-gray-500 mt-1">States Represented</p>
          </div>
        </div>

        {/* Audience */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Audience (First-Party · Last 30 Days)</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{n(sessions)}</p>
            <p className="text-xs text-gray-500 mt-1">Sessions</p>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{n(visitors)}</p>
            <p className="text-xs text-gray-500 mt-1">Unique Visitors</p>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{avgDuration}s</p>
            <p className="text-xs text-gray-500 mt-1">Avg Session Duration</p>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{avgPages}</p>
            <p className="text-xs text-gray-500 mt-1">Avg Pages / Visit</p>
          </div>
        </div>

        {/* Device + Mobile */}
        {totalDevices > 0 && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 flex items-center gap-8 flex-wrap">
            <div>
              <p className="text-2xl font-bold text-gray-900">{pct(mobileCount, totalDevices)}</p>
              <p className="text-xs text-gray-500">Mobile + Tablet visitors</p>
            </div>
            {Object.entries(deviceBreakdown).map(([device, count]) => (
              <div key={device}>
                <p className="text-lg font-semibold text-gray-800">{pct(count as number, totalDevices)}</p>
                <p className="text-xs text-gray-500 capitalize">{device}</p>
              </div>
            ))}
          </div>
        )}

        {/* Top Countries */}
        {topCountries.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Audience Countries</h3>
            <div className="flex flex-wrap gap-3">
              {topCountries.slice(0, 6).map((c: any) => (
                <div key={c.country} className="border rounded-lg px-4 py-2 text-center">
                  <p className="font-semibold text-gray-900">{c.country}</p>
                  <p className="text-xs text-gray-500">{n(c.count)} sessions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Pages */}
        {topPages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Most Visited Pages</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Page</th>
                  <th className="text-right py-2 text-gray-500">Page Views</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">{p.page}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{n(p.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Listings */}
        {topListings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Top Listings by Engagement</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Business</th>
                  <th className="text-right py-2 text-gray-500">Profile Views</th>
                  <th className="text-right py-2 text-gray-500">Interactions</th>
                </tr>
              </thead>
              <tbody>
                {topListings.map((l: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">{l.name}</td>
                    <td className="py-2 text-right text-gray-900">{n(l.views)}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{n(l.clicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Searches */}
        {topSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">What People Are Searching For</h2>
            <div className="flex flex-wrap gap-2">
              {topSearches.map((s: any, i: number) => (
                <span
                  key={i}
                  className="bg-[#0038A8] text-white text-sm px-3 py-1.5 rounded-full"
                  style={{ opacity: 1 - i * 0.07 }}
                >
                  {s.query}
                  <span className="ml-1 opacity-70 text-xs">({s.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Listings by Category */}
        {listingsByCategory.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Directory by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listingsByCategory.slice(0, 9).map((cat: any) => (
                <div key={cat.category} className="border rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{cat.category}</p>
                  <p className="text-sm text-gray-500">{n(cat.count)} listings</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsorship Opportunities */}
        <div className="border-2 border-[#FCD116] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sponsorship Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: 'Featured Listing',
                desc: 'Pin your business to the top of city and category search results',
                color: '#0038A8',
              },
              {
                tier: 'Homepage Spotlight',
                desc: 'Prime placement on the FFNM homepage with photo and call-to-action',
                color: '#CE1126',
              },
              {
                tier: 'Newsletter Partner',
                desc: 'Reach our community directly via our monthly Filipino food newsletter',
                color: '#4a7c59',
              },
            ].map(op => (
              <div key={op.tier} className="rounded-lg p-4 border" style={{ borderLeftColor: op.color, borderLeftWidth: 4 }}>
                <p className="font-bold text-gray-900">{op.tier}</p>
                <p className="text-sm text-gray-600 mt-1">{op.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Contact us: <strong>advertise@filipinofoodnearme.org</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-6 border-t">
          <p>FilipinoFoodNearMe.org · filipinofoodnearme.org</p>
          <p className="mt-1">Data sourced from first-party analytics · {generatedAt}</p>
          <p className="mt-1">Confidential — for sponsor use only</p>
        </div>
      </div>
    </div>
  )
}
