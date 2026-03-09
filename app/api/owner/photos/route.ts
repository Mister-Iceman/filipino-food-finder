import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function makeSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function resolveToken(supabase: ReturnType<typeof makeSupabase>, token: string) {
  // Try owner_sessions
  const { data: session } = await supabase
    .from('owner_sessions')
    .select('email, listing_slug, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (session && !session.used && new Date(session.expires_at) >= new Date()) {
    return { email: session.email, listingSlug: session.listing_slug }
  }

  // Fall back to business_owners
  const { data: owner } = await supabase
    .from('business_owners')
    .select('owner_email, listing_id')
    .eq('dashboard_token', token)
    .single()

  if (owner) {
    const { data: listing } = await supabase
      .from('listings')
      .select('slug')
      .eq('id', owner.listing_id)
      .single()
    if (listing) return { email: owner.owner_email, listingSlug: listing.slug }
  }

  return null
}

export async function GET(request: NextRequest) {
  const supabase = makeSupabase()
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const session = await resolveToken(supabase, token)
  if (!session) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

  const { data: photos, error } = await supabase
    .from('listing_photos')
    .select('id, storage_path, status, created_at')
    .eq('listing_id', session.listingSlug)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: 'Failed to load photos' }, { status: 500 })

  // Generate signed URLs for each photo
  const withUrls = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data: signed } = await supabase.storage
        .from('listing-photos')
        .createSignedUrl(photo.storage_path, 3600)
      return { ...photo, url: signed?.signedUrl ?? null }
    })
  )

  return NextResponse.json({ photos: withUrls })
}
