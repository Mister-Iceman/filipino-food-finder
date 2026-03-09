import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { token, photoId } = await request.json()
  if (!token || !photoId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Validate token
  const { data: session } = await supabase
    .from('owner_sessions')
    .select('listing_slug, used, expires_at')
    .eq('token', token)
    .single()

  if (!session || new Date(session.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // Fetch photo — must belong to this listing
  const { data: photo } = await supabase
    .from('listing_photos')
    .select('id, storage_path, listing_id, status')
    .eq('id', photoId)
    .eq('listing_id', session.listing_slug)
    .in('status', ['pending', 'approved'])
    .single()

  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

  // Remove from storage
  await supabase.storage.from('listing-photos').remove([photo.storage_path])

  // Delete from DB
  await supabase.from('listing_photos').delete().eq('id', photoId)

  return NextResponse.json({ success: true })
}
