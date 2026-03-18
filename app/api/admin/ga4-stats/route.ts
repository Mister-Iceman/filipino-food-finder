import { NextResponse } from 'next/server'
import { createSign } from 'crypto'

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(privateKey, 'base64url')
  const jwt = `${header}.${payload}.${signature}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth2:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) throw new Error('Failed to get access token: ' + JSON.stringify(tokenData))
  return tokenData.access_token
}

export async function GET() {
  const propertyId = process.env.GA4_PROPERTY_ID
  const clientEmail = process.env.GA4_CLIENT_EMAIL
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json({ connected: false })
  }

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey)
    const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    const [overviewRes, dailyRes, topPagesRes, sourcesRes, citiesRes] = await Promise.all([
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'sessions' },
            { name: 'screenPageViews' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' },
          ],
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'city' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
          limit: 10,
        }),
      }),
    ])

    const [overview, daily, topPages, sources, audienceCities] = await Promise.all([
      overviewRes.json(), dailyRes.json(), topPagesRes.json(), sourcesRes.json(), citiesRes.json(),
    ])

    const [devicesRes, countriesRes, todayRes, weekRes] = await Promise.all([
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'totalUsers' }],
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
          limit: 10,
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          metrics: [{ name: 'totalUsers' }],
        }),
      }),
      fetch(baseUrl, {
        method: 'POST', headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          metrics: [{ name: 'totalUsers' }],
        }),
      }),
    ])

    const [devices, countries, today, week] = await Promise.all([
      devicesRes.json(), countriesRes.json(), todayRes.json(), weekRes.json(),
    ])

    // Parse overview
    const mv = overview.rows?.[0]?.metricValues ?? []
    const users30d = parseInt(mv[0]?.value ?? '0')
    const newUsers30d = parseInt(mv[1]?.value ?? '0')
    const sessions30d = parseInt(mv[2]?.value ?? '0')
    const pageViews30d = parseInt(mv[3]?.value ?? '0')
    const bounceRate = Math.round(parseFloat(mv[4]?.value ?? '0') * 100)
    const avgSec = Math.round(parseFloat(mv[5]?.value ?? '0'))
    const mins = Math.floor(avgSec / 60)
    const secs = avgSec % 60
    const avgSessionDurationFormatted = `${mins}m ${secs}s`

    // Daily traffic
    const dailyTraffic = (daily.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      date: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }))

    // Top pages
    const topPagesData = (topPages.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      avgTime: Math.round(parseFloat(row.metricValues[1].value)),
    }))

    // Traffic sources
    const totalSessions = (sources.rows ?? []).reduce(
      (s: number, r: Record<string, { value: string }[]>) => s + parseInt(r.metricValues[0].value), 0
    )
    const trafficSources = (sources.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      pct: totalSessions > 0
        ? Math.round((parseInt(row.metricValues[0].value) / totalSessions) * 100)
        : 0,
    }))

    const topCitiesGA4 = (audienceCities.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      city: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }))

    const deviceBreakdown = (devices.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      device: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }))

    const topCountries = (countries.rows ?? []).map((row: Record<string, { value: string }[]>) => ({
      country: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    }))

    const usersToday = parseInt(today.rows?.[0]?.metricValues[0]?.value ?? '0')
    const usersThisWeek = parseInt(week.rows?.[0]?.metricValues[0]?.value ?? '0')
    const topTrafficSource = sources.rows?.[0]?.dimensionValues[0]?.value ?? 'Unknown'

    return NextResponse.json({
      connected: true,
      users30d, newUsers30d, sessions30d, pageViews30d,
      bounceRate, avgSessionDuration: avgSec, avgSessionDurationFormatted,
      usersToday, usersThisWeek,
      dailyTraffic, topPages: topPagesData, trafficSources,
      topCities: topCitiesGA4, deviceBreakdown, topCountries,
      monthlyUniqueVisitors: users30d,
      monthlyPageViews: pageViews30d,
      topTrafficSource,
    })
  } catch (error) {
    console.error('[ga4-stats]', error)
    return NextResponse.json({ connected: false, error: String(error) })
  }
}
