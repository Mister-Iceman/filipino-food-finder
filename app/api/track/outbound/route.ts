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
      session_id, visitor_id, destination_url,
      link_type, source_page, listing_id,
    } = body

    if (!session_id || !visitor_id || !destination_url) return OK

    await supabase.from('outbound_clicks').insert({
      session_id,
      visitor_id,
      destination_url,
      link_type: link_type ?? null,
      source_page: source_page ?? null,
      listing_id: listing_id ?? null,
    })

    return OK
  } catch {
    return OK
  }
}
