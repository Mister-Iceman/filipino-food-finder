import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, category_primary, address_street, city, state, zip,
      phone, website, google_maps_url, description, hours,
      google_rating, google_reviews_count
    } = body

    if (!name || !category_primary || !address_street || !city || !state || !zip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Hard guardrail: reject exact duplicate (name + city + state, case-insensitive)
    const { data: duplicate } = await supabase
      .from('listings')
      .select('id, name, city, state')
      .ilike('name', name)
      .ilike('city', city)
      .ilike('state', state)
      .limit(1)
      .maybeSingle()

    if (duplicate) {
      return NextResponse.json(
        { error: `A listing named "${duplicate.name}" already exists in ${duplicate.city}, ${duplicate.state}. If this is a different location, use a more specific name.` },
        { status: 409 }
      )
    }

    const baseSlug = [name, city, state]
      .map(s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
      .join('-')

    // Find a unique slug by checking existing ones
    let slug = baseSlug
    let suffix = 2
    while (true) {
      const { data: existing } = await supabase
        .from('listings')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      slug = `${baseSlug}-${suffix}`
      suffix++
    }

    const { error } = await supabase
      .from('listings')
      .insert([{
        name,
        slug,
        category_primary,
        address_street,
        city,
        state,
        zip,
        phone: phone || null,
        website: website || null,
        google_maps_url: google_maps_url || null,
        description: description || null,
        hours: hours || null,
        google_rating: google_rating ? parseFloat(google_rating) : null,
        google_reviews_count: google_reviews_count ? parseInt(google_reviews_count, 10) : null,
      }])

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    // Bust ISR cache so the new listing appears immediately
    revalidatePath('/directory')
    revalidatePath('/')
    revalidatePath('/restaurants')
    revalidatePath('/bakeries')
    revalidatePath('/grocery-stores')
    revalidatePath('/food-trucks')
    revalidatePath('/quick-bites')

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Add listing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add listing' },
      { status: 500 }
    )
  }
}
