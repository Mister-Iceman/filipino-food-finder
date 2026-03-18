import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString()

    const [
      totalListingsRes,
      allCitiesRes,
      allStatesRes,
      submissionsThisMonthRes,
      pendingSubmissionsRes,
      listingsByCategoryRes,
      monthlyGrowthRes,
      withDescriptionRes,
      withPhoneRes,
      withWebsiteRes,
      withHoursRes,
      approvedPhotosRes,
      pipelineRejectedRes,
      recentActivityRes,
    ] = await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }),
      supabase.from('listings').select('city'),
      supabase.from('listings').select('state'),
      supabase.from('business_submissions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', firstOfMonth),
      supabase.from('business_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase.from('listings').select('category_primary'),
      supabase.from('listings').select('created_at').gte('created_at', twelveMonthsAgo),
      supabase.from('listings')
        .select('id', { count: 'exact', head: true })
        .not('description', 'is', null)
        .neq('description', ''),
      supabase.from('listings')
        .select('id', { count: 'exact', head: true })
        .not('phone', 'is', null)
        .neq('phone', ''),
      supabase.from('listings')
        .select('id', { count: 'exact', head: true })
        .not('website', 'is', null)
        .neq('website', ''),
      supabase.from('listings')
        .select('id', { count: 'exact', head: true })
        .not('hours', 'is', null)
        .neq('hours', ''),
      supabase.from('listing_photos').select('listing_id').eq('status', 'approved'),
      supabase.from('business_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'rejected'),
      supabase.from('business_submissions')
        .select('id, business_name, city, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    const totalListings = totalListingsRes.count ?? 0

    // Distinct cities and states
    const cities = (allCitiesRes.data ?? []).map(r => r.city).filter(Boolean)
    const states = (allStatesRes.data ?? []).map(r => r.state).filter(Boolean)
    const distinctCities = new Set(cities).size
    const distinctStates = new Set(states).size

    // Top cities by listing count
    const cityCount: Record<string, number> = {}
    cities.forEach(c => { cityCount[c] = (cityCount[c] ?? 0) + 1 })
    const topCitiesByListings = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }))

    // Top states by listing count
    const stateCount: Record<string, number> = {}
    states.forEach(s => { stateCount[s] = (stateCount[s] ?? 0) + 1 })
    const topStatesByListings = Object.entries(stateCount)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({ state, count }))

    // Listings by category
    const catCount: Record<string, number> = {}
    ;(listingsByCategoryRes.data ?? []).forEach(r => {
      const cat = r.category_primary ?? 'Unknown'
      catCount[cat] = (catCount[cat] ?? 0) + 1
    })
    const listingsByCategory = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }))

    // Monthly growth — build 12-month buckets
    const bucketKeys: string[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setMonth(d.getMonth() - i)
      bucketKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    const monthCounts: Record<string, number> = {}
    bucketKeys.forEach(k => { monthCounts[k] = 0 })
    ;(monthlyGrowthRes.data ?? []).forEach(r => {
      const key = r.created_at.slice(0, 7)
      if (key in monthCounts) monthCounts[key]++
    })
    const monthlyGrowth = bucketKeys.map(key => {
      const [year, month] = key.split('-')
      const d = new Date(parseInt(year), parseInt(month) - 1, 1)
      return {
        month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        count: monthCounts[key],
      }
    })

    // Content health — photos: count distinct listing_ids with approved photos
    const photosWithListings = new Set(
      (approvedPhotosRes.data ?? []).map(r => r.listing_id).filter(Boolean)
    ).size

    const contentHealth = {
      total: totalListings,
      withPhotos: photosWithListings,
      withDescriptions: withDescriptionRes.count ?? 0,
      withPhones: withPhoneRes.count ?? 0,
      withWebsites: withWebsiteRes.count ?? 0,
      withHours: withHoursRes.count ?? 0,
    }

    const pipeline = {
      pending: pendingSubmissionsRes.count ?? 0,
      active: totalListings,
      featured: 0,
      rejected: pipelineRejectedRes.count ?? 0,
    }

    const recentActivity = (recentActivityRes.data ?? []).map(r => ({
      id: r.id,
      name: r.business_name,
      city: r.city,
      status: r.status,
      created_at: r.created_at,
    }))

    return NextResponse.json({
      totalActiveListings: totalListings,
      totalListingsAllTime: totalListings,
      citiesCovered: distinctCities,
      statesCovered: distinctStates,
      submissionsThisMonth: submissionsThisMonthRes.count ?? 0,
      pendingSubmissions: pendingSubmissionsRes.count ?? 0,
      listingsByCategory,
      topCitiesByListings,
      topStatesByListings,
      monthlyGrowth,
      contentHealth,
      pipeline,
      recentActivity,
    })
  } catch (error) {
    console.error('[analytics-kpis]', error)
    return NextResponse.json({ error: 'Failed to load KPIs' }, { status: 500 })
  }
}
