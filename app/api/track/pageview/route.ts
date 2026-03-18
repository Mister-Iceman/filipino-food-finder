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

    // Fire geo lookup in background — don't await blocking the response
    const geoPromise = getGeo(ip)

    const {
      session_id, visitor_id, page_path, page_title,
      referrer, utm_source, utm_medium, utm_campaign,
      device_type, browser, os,
      screen_width, screen_height,
      duration_seconds, scroll_depth, is_bounce,
      step_number, action,
    } = body

    // Skip if essential fields missing
    if (!session_id || !visitor_id || !page_path) return OK

    // UPDATE mode (sent via sendBeacon on page exit)
    if (action === 'update') {
      await supabase
        .from('page_views')
        .update({
          duration_seconds: duration_seconds ?? null,
          scroll_depth: scroll_depth ?? null,
          is_bounce: is_bounce ?? false,
        })
        .eq('session_id', session_id)
        .eq('page_path', page_path)
        .order('created_at', { ascending: false })
        .limit(1)
      return OK
    }

    const geo = await geoPromise

    // INSERT new page view
    await supabase.from('page_views').insert({
      session_id,
      visitor_id,
      page_path,
      page_title: page_title ?? null,
      referrer: referrer ?? null,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      device_type: device_type ?? parseDevice(ua),
      browser: browser ?? parseBrowser(ua),
      os: os ?? null,
      country: geo.country ?? null,
      region: geo.region ?? null,
      city: geo.city ?? null,
      screen_width: screen_width ?? null,
      screen_height: screen_height ?? null,
      step_number: step_number ?? null,
    })

    // Also track in user_journeys if step_number provided
    if (step_number != null) {
      try {
        await supabase.from('user_journeys').insert({
          session_id,
          visitor_id,
          step_number,
          page_path,
          time_on_previous_page: body.time_on_previous_page ?? null,
        })
      } catch { /* fail silently */ }
    }

    return OK
  } catch {
    return OK
  }
}
