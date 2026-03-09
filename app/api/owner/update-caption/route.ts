import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let body: { token?: string; photoId?: string; caption?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const { token, photoId, caption } = body
  if (!token || !photoId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Validate token — try owner_sessions first, then business_owners
  let ownerEmail: string | null = null

  const { data: session } = await supabase
    .from('owner_sessions')
    .select('email, listing_slug, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (session && !session.used && new Date(session.expires_at) >= new Date()) {
    ownerEmail = session.email
  } else {
    const { data: owner } = await supabase
      .from('business_owners')
      .select('owner_email')
      .eq('dashboard_token', token)
      .single()
    if (owner) ownerEmail = owner.owner_email
  }

  if (!ownerEmail) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

  // Verify photo belongs to this owner
  const { data: photo } = await supabase
    .from('listing_photos')
    .select('id')
    .eq('id', photoId)
    .eq('owner_email', ownerEmail)
    .single()

  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

  const trimmed = (caption ?? '').trim().slice(0, 50)

  await supabase
    .from('listing_photos')
    .update({ caption: trimmed || null })
    .eq('id', photoId)

  return NextResponse.json({ success: true })
}
