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
    ready_to_eat
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

  const { error: insertError } = await supabase
    .from('ratings')
    .insert(ratingData)

  if (insertError) {
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}