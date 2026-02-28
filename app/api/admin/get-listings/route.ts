import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PAGE_SIZE = 20

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10))

  if (search) {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from('listings')
      .select('id, name, category_primary, city, state, google_rating, created_at', { count: 'exact' })
      .or(`name.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      console.error('[get-listings] search error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listings: data ?? [], totalCount: count ?? 0, page })
  } else {
    const { data, error } = await supabase
      .from('listings')
      .select('id, name, category_primary, city, state, google_rating, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[get-listings] default load error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ listings: data ?? [], totalCount: 0, page: 0 })
  }
}
