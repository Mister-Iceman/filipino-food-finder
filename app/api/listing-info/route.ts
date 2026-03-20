import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 })
  const { data: listing, error } = await supabase
    .from('listings')
    .select('id, name, city, state')
    .eq('slug', slug)
    .single()
  if (error || !listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(listing, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  })
}
