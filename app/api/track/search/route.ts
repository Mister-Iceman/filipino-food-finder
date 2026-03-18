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
      session_id, visitor_id, query,
      results_count, clicked_result_id, clicked_result_name,
      filters_used,
    } = body

    if (!session_id || !visitor_id || !query) return OK

    await supabase.from('search_queries').insert({
      session_id,
      visitor_id,
      query,
      results_count: results_count ?? null,
      clicked_result_id: clicked_result_id ?? null,
      clicked_result_name: clicked_result_name ?? null,
      filters_used: filters_used ?? {},
    })

    return OK
  } catch {
    return OK
  }
}
