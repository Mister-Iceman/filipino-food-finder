import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getIP, checkRateLimit, parseDevice, parseBrowser, getGeo } from '../../../../lib/track-rate-limit'

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
    const ua = req.headers.get('user-agent') ?? ''
    const { id, visitor_id, action } = body

    if (!id) return OK

    if (action === 'start') {
      const geoPromise = getGeo(ip)
      const {
        entry_page, referrer, utm_source, utm_medium, utm_campaign,
        device_type, browser, os, screen_width, screen_height,
      } = body
      const geo = await geoPromise

      // Upsert session (ignore duplicate on re-visit)
      await supabase.from('sessions').upsert({
        id,
        visitor_id,
        entry_page: entry_page ?? null,
        referrer: referrer ?? null,
        utm_source: utm_source ?? null,
        utm_medium: utm_medium ?? null,
        utm_campaign: utm_campaign ?? null,
        device_type: device_type ?? parseDevice(ua),
        browser: browser ?? parseBrowser(ua),
        os: os ?? null,
        country: geo.country ?? null,
        city: geo.city ?? null,
      }, { onConflict: 'id', ignoreDuplicates: true })
    } else if (action === 'update') {
      const { page_count, exit_page } = body
      await supabase
        .from('sessions')
        .update({
          page_count: page_count ?? undefined,
          exit_page: exit_page ?? undefined,
          ended_at: new Date().toISOString(),
          duration_seconds: body.duration_seconds ?? undefined,
        })
        .eq('id', id)
    } else if (action === 'end') {
      const { page_count, exit_page, duration_seconds } = body
      await supabase
        .from('sessions')
        .update({
          page_count: page_count ?? undefined,
          exit_page: exit_page ?? undefined,
          ended_at: new Date().toISOString(),
          duration_seconds: duration_seconds ?? undefined,
        })
        .eq('id', id)
    }

    return OK
  } catch {
    return OK
  }
}
