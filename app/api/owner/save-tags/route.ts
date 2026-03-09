import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const {
    token,
    verified_dish_ids = [],
    unverified_dish_ids = [],
    verified_grocery_ids = [],
    unverified_grocery_ids = [],
    verified_universal_ids = [],
    unverified_universal_ids = [],
  } = await req.json()

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // Validate token — try owner_sessions first, then business_owners
  let businessId: number | null = null

  const { data: session } = await supabase
    .from('owner_sessions')
    .select('listing_slug, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (session && !session.used && new Date(session.expires_at) >= new Date()) {
    const { data: listing } = await supabase
      .from('listings')
      .select('id')
      .eq('slug', session.listing_slug)
      .single()
    if (listing) businessId = listing.id
  }

  if (businessId === null) {
    const { data: owner } = await supabase
      .from('business_owners')
      .select('listing_id')
      .eq('dashboard_token', token)
      .single()
    if (owner) businessId = owner.listing_id
  }

  if (businessId === null) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calls: Array<ReturnType<typeof supabase.rpc>> = []

  if (verified_dish_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_dish_verified', {
        p_business_id: businessId,
        p_dish_tag_ids: verified_dish_ids,
        p_verified: true,
      })
    )
  }
  if (unverified_dish_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_dish_verified', {
        p_business_id: businessId,
        p_dish_tag_ids: unverified_dish_ids,
        p_verified: false,
      })
    )
  }
  if (verified_grocery_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_grocery_verified', {
        p_business_id: businessId,
        p_grocery_tag_ids: verified_grocery_ids,
        p_verified: true,
      })
    )
  }
  if (unverified_grocery_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_grocery_verified', {
        p_business_id: businessId,
        p_grocery_tag_ids: unverified_grocery_ids,
        p_verified: false,
      })
    )
  }
  if (verified_universal_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_universal_verified', {
        p_business_id: businessId,
        p_universal_tag_ids: verified_universal_ids,
        p_verified: true,
      })
    )
  }
  if (unverified_universal_ids.length > 0) {
    calls.push(
      supabase.rpc('owner_set_universal_verified', {
        p_business_id: businessId,
        p_universal_tag_ids: unverified_universal_ids,
        p_verified: false,
      })
    )
  }

  if (calls.length === 0) {
    return NextResponse.json({ success: true })
  }

  const results = await Promise.all(calls)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    return NextResponse.json({ error: 'Failed to save some tags' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
