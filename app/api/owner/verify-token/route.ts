import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // Validate token and fetch owner + listing
  const { data: owner, error: ownerError } = await supabase
    .from('business_owners')
    .select('listing_id, owner_email, owner_name, is_primary, claimed_at')
    .eq('dashboard_token', token)
    .single()

  if (ownerError || !owner) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, name, slug, address_street, city, state, zip, category_primary, is_claimed')
    .eq('id', owner.listing_id)
    .single()

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Fetch tag statuses in parallel
  const [dishResult, groceryResult, universalResult] = await Promise.all([
    supabase
      .from('business_dish_tags')
      .select('dish_tag_id, confirmed_count, verified_by_owner')
      .eq('business_id', owner.listing_id),
    supabase
      .from('business_grocery_tags')
      .select('grocery_tag_id, confirmed_count, verified_by_owner')
      .eq('business_id', owner.listing_id),
    supabase
      .from('business_universal_tags')
      .select('universal_tag_id, confirmed_count, verified_by_owner')
      .eq('business_id', owner.listing_id),
  ])

  const dish_tag_statuses = (dishResult.data ?? []).map(r => ({
    tag_id: r.dish_tag_id,
    confirmed_count: r.confirmed_count,
    verified_by_owner: r.verified_by_owner,
  }))

  const grocery_tag_statuses = (groceryResult.data ?? []).map(r => ({
    tag_id: r.grocery_tag_id,
    confirmed_count: r.confirmed_count,
    verified_by_owner: r.verified_by_owner,
  }))

  const universal_tag_statuses = (universalResult.data ?? []).map(r => ({
    tag_id: r.universal_tag_id,
    confirmed_count: r.confirmed_count,
    verified_by_owner: r.verified_by_owner,
  }))

  return NextResponse.json({
    owner,
    listing,
    dish_tag_statuses,
    grocery_tag_statuses,
    universal_tag_statuses,
  })
}
