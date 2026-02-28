import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Context = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params

  const body = await request.json()
  const {
    name, category_primary, address_street, city, state, zip,
    phone, website, google_maps_url, description, hours,
    google_rating, google_reviews_count,
  } = body

  if (!name || !city || !state) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch current slug before update so we can revalidate the listing page
  const { data: current } = await supabase
    .from('listings')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('listings')
    .update({
      name,
      category_primary,
      address_street: address_street || null,
      city,
      state,
      zip: zip || null,
      phone: phone || null,
      website: website || null,
      google_maps_url: google_maps_url || null,
      description: description || null,
      hours: hours || null,
      google_rating: google_rating ? parseFloat(google_rating) : null,
      google_reviews_count: google_reviews_count ? parseInt(google_reviews_count, 10) : null,
    })
    .eq('id', id)

  if (error) {
    console.error('Edit listing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath('/')
  revalidatePath('/directory')
  revalidatePath('/restaurants')
  revalidatePath('/bakeries')
  revalidatePath('/grocery-stores')
  revalidatePath('/food-trucks')
  revalidatePath('/quick-bites')
  if (current?.slug) {
    revalidatePath(`/listings/${current.slug}`)
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params

  // Fetch slug before deleting so we can revalidate the listing page
  const { data: current } = await supabase
    .from('listings')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath('/')
  revalidatePath('/directory')
  revalidatePath('/restaurants')
  revalidatePath('/bakeries')
  revalidatePath('/grocery-stores')
  revalidatePath('/food-trucks')
  revalidatePath('/quick-bites')
  if (current?.slug) {
    revalidatePath(`/listings/${current.slug}`)
  }

  return NextResponse.json({ success: true })
}
