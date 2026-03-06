/*
 * ============================================================
 * SUPABASE SQL — Run this in the Supabase dashboard SQL editor
 * ============================================================
 *
 * create table analytics_events (
 *   id uuid default gen_random_uuid() primary key,
 *   event_type text not null, -- 'page_view', 'listing_click', 'search', 'add_business_start', 'add_business_complete'
 *   page text,
 *   referrer text,
 *   user_agent text,
 *   device_type text, -- 'mobile', 'tablet', 'desktop'
 *   browser text,
 *   country text,
 *   city text,
 *   search_query text,
 *   listing_id text,
 *   session_id text,
 *   created_at timestamptz default now()
 * );
 *
 * create index on analytics_events (event_type);
 * create index on analytics_events (created_at);
 * create index on analytics_events (page);
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_EVENT_TYPES = [
  'page_view',
  'listing_click',
  'search',
  'add_business_start',
  'add_business_complete',
  'engagement',
  'impression',
  'lead_action',
  'article_read',
]

function detectDeviceType(ua: string): string {
  if (!ua) return 'desktop'
  const lower = ua.toLowerCase()
  if (/mobile|android(?!.*tablet)|iphone|ipod|blackberry|windows phone/.test(lower)) return 'mobile'
  if (/tablet|ipad|kindle|silk|playbook/.test(lower)) return 'tablet'
  return 'desktop'
}

function detectBrowser(ua: string): string {
  if (!ua) return 'unknown'
  if (/edg\//i.test(ua)) return 'Edge'
  if (/opr\/|opera/i.test(ua)) return 'Opera'
  if (/chrome\/[0-9]/i.test(ua) && !/chromium/i.test(ua)) return 'Chrome'
  if (/safari\/[0-9]/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/msie|trident/i.test(ua)) return 'IE'
  return 'Other'
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      event_type, page, referrer, search_query, listing_id, session_id,
      scroll_depth, active_time, total_time, section, article_slug, lead_type,
    } = body

    if (!ALLOWED_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') ?? ''
    const device_type = detectDeviceType(ua)
    const browser = detectBrowser(ua)

    let country: string | null = null
    let city: string | null = null

    try {
      const ip = getClientIp(req)
      if (ip && ip !== '127.0.0.1' && ip !== '::1') {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: { 'User-Agent': 'filipinofoodnearne-analytics/1.0' },
          signal: AbortSignal.timeout(3000),
        })
        if (geoRes.ok) {
          const geo = await geoRes.json()
          country = geo.country_name ?? null
          city = geo.city ?? null
        }
      }
    } catch {
      // geo lookup failed — continue without it
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from('analytics_events').insert({
      event_type,
      page: page ?? null,
      referrer: referrer ?? null,
      user_agent: ua || null,
      device_type,
      browser,
      country,
      city,
      search_query: search_query ?? null,
      listing_id: listing_id ? String(listing_id) : null,
      session_id: session_id ?? null,
      scroll_depth: scroll_depth != null ? Number(scroll_depth) : null,
      active_time: active_time != null ? Number(active_time) : null,
      total_time: total_time != null ? Number(total_time) : null,
      section: section ?? null,
      article_slug: article_slug ?? null,
      lead_type: lead_type ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never break the user experience
    return NextResponse.json({ ok: true })
  }
}
