import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getIP, checkRateLimit } from '../../../../lib/track-rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OK = NextResponse.json({ ok: true })

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    if (!checkRateLimit(ip)) return OK

    const body = await req.json().catch(() => ({}))
    const {
      session_id, visitor_id, interaction_type,
      listing_id, listing_name, listing_category, listing_city,
      metadata,
    } = body

    if (!session_id || !visitor_id || !interaction_type) return OK

    await supabase.from('listing_interactions').insert({
      session_id,
      visitor_id,
      interaction_type,
      listing_id: listing_id ?? null,
      listing_name: listing_name ?? null,
      listing_category: listing_category ?? null,
      listing_city: listing_city ?? null,
      metadata: metadata ?? {},
    })

    return OK
  } catch {
    return OK
  }
}
