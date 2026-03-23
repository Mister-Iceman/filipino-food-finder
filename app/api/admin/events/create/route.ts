import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_PASSWORD = 'R@ikkonenProjpagkain2026'

export async function POST(request: Request) {
  const body = await request.json()
  
  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([body.eventData])
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const toSlug = (title: string, city: string, date: string) =>
    `${title}-${city}-${date}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80)

  const eventData = body.eventData
  const slug = toSlug(eventData.title ?? '', eventData.city ?? '', eventData.event_date ?? '') + '-ffnm-' + data[0].id

  await supabaseAdmin.from('fenm_events').upsert({
    id: crypto.randomUUID(),
    slug,
    title: eventData.title,
    organizer: eventData.organizer ?? null,
    start_date: eventData.event_date,
    start_time: eventData.event_time ?? null,
    venue_name: eventData.location_name ?? null,
    city: eventData.city ?? null,
    state: eventData.state ?? null,
    category: eventData.category === 'pop_up' ? 'food-markets' : eventData.category === 'festival' ? 'food-markets' : 'community-family',
    status: 'active',
    show_on_ffnm: true,
    source: 'ffnm',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'slug' })

  return NextResponse.json({ data })
}