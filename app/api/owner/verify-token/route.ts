import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { OwnerDashboardData } from '@/lib/types/owner'
import { toSlug, stateHintFromSlug } from '@/lib/listing-slug'

function makeSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function buildTagStatuses(supabase: ReturnType<typeof makeSupabase>, listingId: number) {
  const [dishRes, groceryRes, universalRes] = await Promise.all([
    supabase.from('business_dish_tags').select('dish_tag_id, confirmed_count, verified_by_owner').eq('listing_id', listingId),
    supabase.from('business_grocery_tags').select('grocery_tag_id, confirmed_count, verified_by_owner').eq('listing_id', listingId),
    supabase.from('business_universal_tags').select('universal_tag_id, confirmed_count, verified_by_owner').eq('listing_id', listingId),
  ])
  return {
    dish_tag_statuses: (dishRes.data ?? []).map(r => ({ tag_id: r.dish_tag_id, confirmed_count: r.confirmed_count, verified_by_owner: r.verified_by_owner })),
    grocery_tag_statuses: (groceryRes.data ?? []).map(r => ({ tag_id: r.grocery_tag_id, confirmed_count: r.confirmed_count, verified_by_owner: r.verified_by_owner })),
    universal_tag_statuses: (universalRes.data ?? []).map(r => ({ tag_id: r.universal_tag_id, confirmed_count: r.confirmed_count, verified_by_owner: r.verified_by_owner })),
  }
}

// GET — simple validity check (used externally)
export async function GET(request: NextRequest) {
  const supabase = makeSupabase()
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.json({ valid: false })

  const { data, error } = await supabase
    .from('owner_sessions')
    .select('email, listing_slug, used, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ valid: false })
  if (data.used) return NextResponse.json({ valid: false, reason: 'used' })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ valid: false, reason: 'expired' })

  return NextResponse.json({ valid: true, email: data.email, listingSlug: data.listing_slug })
}

// POST — full dashboard data (used by owner dashboard on load)
export async function POST(request: NextRequest) {
  const supabase = makeSupabase()

  let body: { token?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const { token } = body
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  // ── Try owner_sessions first (magic link flow) ──────────────────────────
  const { data: session } = await supabase
    .from('owner_sessions')
    .select('email, listing_slug, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (session) {
    if (session.used) {
      return NextResponse.json({ error: 'This link has already been used. Please request a new one.' }, { status: 401 })
    }
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This link has expired. Please request a new one.' }, { status: 401 })
    }

    // No slug column — reconstruct slug from name+city+state and match in memory
    const slugToFind = session.listing_slug
    const stateHint = stateHintFromSlug(slugToFind)
    const listingQuery = supabase
      .from('listings')
      .select('id, name, address_street, city, state, zip, category_primary, is_claimed')
    const { data: listingCandidates } = stateHint
      ? await listingQuery.ilike('state', stateHint)
      : await listingQuery
    const listing = (listingCandidates ?? []).find(
      (l: { name: string; city: string; state: string }) =>
        toSlug(l.name ?? '', l.city ?? '', l.state ?? '') === slugToFind
    ) ?? null

    if (!listing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })

    const { data: claim } = await supabase
      .from('claim_requests')
      .select('claimant_name, created_at')
      .eq('claimant_email', session.email)
      .eq('listing_name', listing.name)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const tagStatuses = await buildTagStatuses(supabase, listing.id)

    const dashData: OwnerDashboardData = {
      owner: {
        listing_id: listing.id,
        owner_email: session.email,
        owner_name: claim?.claimant_name ?? null,
        is_primary: true,
        claimed_at: claim?.created_at ?? new Date().toISOString(),
      },
      listing: {
        id: listing.id,
        name: listing.name,
        slug: toSlug(listing.name ?? '', listing.city ?? '', listing.state ?? ''),
        address_street: listing.address_street ?? '',
        city: listing.city ?? '',
        state: listing.state ?? '',
        zip: listing.zip ?? '',
        category_primary: listing.category_primary ?? '',
        is_claimed: listing.is_claimed ?? false,
      },
      ...tagStatuses,
    }

    return NextResponse.json(dashData)
  }

  // ── Fall back to business_owners (legacy flow) ──────────────────────────
  const { data: owner, error: ownerError } = await supabase
    .from('business_owners')
    .select('listing_id, owner_email, owner_name, is_primary, claimed_at')
    .eq('dashboard_token', token)
    .single()

  if (ownerError || !owner) {
    return NextResponse.json(
      { error: 'Invalid or expired access link. Please use the link from your approval email.' },
      { status: 401 }
    )
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('id, name, address_street, city, state, zip, category_primary, is_claimed')
    .eq('id', owner.listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })

  const tagStatuses = await buildTagStatuses(supabase, owner.listing_id)

  const dashData: OwnerDashboardData = {
    owner: {
      listing_id: owner.listing_id,
      owner_email: owner.owner_email,
      owner_name: owner.owner_name,
      is_primary: owner.is_primary,
      claimed_at: owner.claimed_at,
    },
    listing: {
      id: listing.id,
      name: listing.name,
      slug: toSlug(listing.name ?? '', listing.city ?? '', listing.state ?? ''),
      address_street: listing.address_street ?? '',
      city: listing.city ?? '',
      state: listing.state ?? '',
      zip: listing.zip ?? '',
      category_primary: listing.category_primary ?? '',
      is_claimed: listing.is_claimed ?? false,
    },
    ...tagStatuses,
  }

  return NextResponse.json(dashData)
}
