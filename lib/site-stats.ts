import { createClient } from '@supabase/supabase-js'
import { retryFetch } from '@/lib/retry-fetch'

// One source of truth for the numbers shown on the home page and the
// Advertise page, so they always agree with each other and with the database.
//
// Supabase returns at most 1,000 rows per request, so the distinct state and
// city counts are built by paging through the table. Reading only one row
// capped at 1,000 used to undercount states (35 shown vs 47 real).

export type NetworkStats = {
  ffnm: {
    listings: number
    states: number
    cities: number
    categories: number
    categoryNames: string[]
  }
  fenm: {
    upcomingEvents: number
    cities: number
    states: number
    categories: number
  }
}

const PAGE = 1000

// "Ga" and "GA" are the same state.
const norm = (v: string | null | undefined) => (v ?? '').trim().toUpperCase()

// Dates further out than this are treated as typos (for example year 152026),
// so they never count as "upcoming".
export function latestSaneDate(): string {
  return new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: retryFetch } }
  )
}

async function fetchAll<T>(
  table: string,
  columns: string,
  filter?: (q: any) => any
): Promise<T[]> {
  const supabase = client()
  const rows: T[] = []
  for (let from = 0; ; from += PAGE) {
    let q = supabase.from(table).select(columns).range(from, from + PAGE - 1)
    if (filter) q = filter(q)
    const { data, error } = await q
    if (error || !data) break
    rows.push(...(data as T[]))
    if (data.length < PAGE) break
  }
  return rows
}

export async function getNetworkStats(): Promise<NetworkStats> {
  const today = new Date().toISOString().split('T')[0]
  const maxDate = latestSaneDate()

  const [listings, events] = await Promise.all([
    fetchAll<{ state: string | null; city: string | null; category_primary: string | null }>(
      'listings',
      'state, city, category_primary'
    ),
    fetchAll<{ state: string | null; city: string | null; category: string | null; start_date: string; end_date: string | null }>(
      'fenm_events',
      'state, city, category, start_date, end_date',
      (q) => q.eq('status', 'active')
    ),
  ])

  const upcoming = events.filter((e) => {
    const lastDay = e.end_date ?? e.start_date
    return lastDay >= today && e.start_date <= maxDate
  })

  return {
    ffnm: {
      listings: listings.length,
      states: new Set(listings.map((r) => norm(r.state)).filter(Boolean)).size,
      // Count city+state pairs so Springfield, IL and Springfield, MO are two cities.
      cities: new Set(listings.filter((r) => r.city).map((r) => `${norm(r.city)}|${norm(r.state)}`)).size,
      categories: new Set(listings.map((r) => r.category_primary).filter(Boolean)).size,
      categoryNames: [...new Set(listings.map((r) => r.category_primary).filter(Boolean) as string[])],
    },
    fenm: {
      upcomingEvents: upcoming.length,
      cities: new Set(events.filter((r) => r.city).map((r) => `${norm(r.city)}|${norm(r.state)}`)).size,
      states: new Set(events.map((r) => norm(r.state)).filter(Boolean)).size,
      categories: new Set(events.map((r) => r.category).filter(Boolean)).size,
    },
  }
}
