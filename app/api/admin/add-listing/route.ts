import { NextRequest, NextResponse } from 'next/server'
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
      phone, website, google_maps_url, description, hours, status
    } = body

    if (!name || !category_primary || !address_street || !city || !state || !zip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + city
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

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
        status: status || 'active',
      }])

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Add listing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add listing' },
      { status: 500 }
    )
  }
}
