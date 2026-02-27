import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.json()
  const {
    email,
    token,
    listing_id,
    listing_category,
    // Restaurant fields
    taste_style,
    price,
    portion_size,
    good_for,
    parking,
    // Grocery fields
    what_they_have,
    selection,
    ready_to_eat,
    // Dish tags (optional, restaurant types only)
    dish_tag_ids,
    // Food tag names → review_keywords (optional, all listing types)
    dish_tags,
  } = body

  // Verify email token
  const { data: verification, error: verifyError } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('email', email)
    .eq('token', token)
    .eq('verified', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (verifyError || !verification) {
    return NextResponse.json({ error: 'Email not verified' }, { status: 401 })
  }

  // Check if user already rated this business
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('user_email', email)
    .eq('listing_id', listing_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You have already rated this business' }, { status: 400 })
  }

  // Insert rating
  const ratingData: any = {
    user_email: email,
    listing_id,
    listing_category,
  }

  if (listing_category === 'restaurant') {
    ratingData.taste_style = taste_style
    ratingData.price = price
    ratingData.portion_size = portion_size
    ratingData.good_for = good_for
    ratingData.parking = parking
  } else if (listing_category === 'grocery') {
    ratingData.what_they_have = what_they_have
    ratingData.selection = selection
    ratingData.price = price
    ratingData.ready_to_eat = ready_to_eat
    ratingData.parking = parking
  }

  const { data: ratingResult, error: insertError } = await supabase
    .from('ratings')
    .insert(ratingData)
    .select('id')
    .single()

  if (insertError || !ratingResult) {
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
  }

  // Save dish tags if provided
  const tagIds: number[] = Array.isArray(dish_tag_ids) ? dish_tag_ids : []

  if (tagIds.length > 0) {
    // Link tags to this individual review
    const reviewTagRows = tagIds.map((dish_tag_id: number) => ({
      rating_id: ratingResult.id,
      dish_tag_id,
    }))

    await supabase.from('review_dish_tags').insert(reviewTagRows)

    // Upsert business_dish_tags — increment confirmed_count atomically via RPC
    await supabase.rpc('upsert_business_dish_tag', {
      p_business_id: listing_id,
      p_dish_tag_ids: tagIds,
    })
  }

  // Append food tag names to review_keywords (deduped, case-insensitive)
  const foodTags: string[] = Array.isArray(dish_tags) ? dish_tags : []
  if (foodTags.length > 0) {
    const { data: listing } = await supabase
      .from('listings')
      .select('review_keywords')
      .eq('id', listing_id)
      .single()

    const existing = listing?.review_keywords || ''
    const existingNormalized = existing
      .split(',')
      .map((k: string) => k.trim().toLowerCase())
      .filter(Boolean)

    const toAdd = foodTags.filter(
      (tag) => !existingNormalized.includes(tag.toLowerCase())
    )

    if (toAdd.length > 0) {
      const updated = existing
        ? `${existing}, ${toAdd.join(', ')}`
        : toAdd.join(', ')
      await supabase
        .from('listings')
        .update({ review_keywords: updated })
        .eq('id', listing_id)
    }
  }

  return NextResponse.json({ success: true })
}